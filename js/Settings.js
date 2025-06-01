const Settings = ({ settings, onSave, onClose, menus }) => {
    const [formData, setFormData] = React.useState({
        ...settings,
        selectedCategories: settings.selectedCategories || [],
        customBackground: settings.customBackground || null
    });
    const [isExporting, setIsExporting] = React.useState(false);
    const [showDialog, setShowDialog] = React.useState(false);
    const [dialogMessage, setDialogMessage] = React.useState('');
    const [scriptsLoaded, setScriptsLoaded] = React.useState(false);
    const [dialogKey, setDialogKey] = React.useState(0);

    // スクリプトの読み込み状態を管理
    React.useEffect(() => {
        const loadScripts = async () => {
            try {
                // スクリプトが既に読み込まれているかチェック
                if (window.jspdf && window.html2canvas) {
                    setScriptsLoaded(true);
                    return;
                }

                const loadScript = (src) => {
                    return new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = src;
                        script.async = true;
                        script.onload = () => {
                            console.log(`Script loaded successfully: ${src}`);
                            resolve();
                        };
                        script.onerror = (error) => {
                            console.error(`Script load error: ${src}`, error);
                            reject(new Error(`Failed to load ${src}`));
                        };
                        document.head.appendChild(script);
                    });
                };

                await Promise.all([
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
                ]);

                // スクリプトが正しく読み込まれたか確認
                if (!window.jspdf || !window.html2canvas) {
                    throw new Error('Scripts not properly loaded');
                }

                setScriptsLoaded(true);
                console.log('All scripts loaded successfully');
            } catch (error) {
                console.error('スクリプトの読み込みエラー:', error);
                showMessage('PDFライブラリの読み込みに失敗しました。ページを更新して再度お試しください。');
            }
        };

        loadScripts();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const getCategoryLabel = (category) => {
        switch (category) {
            case MENU_CATEGORIES.JAPANESE:
                return '和食';
            case MENU_CATEGORIES.WESTERN:
                return '洋食';
            case MENU_CATEGORIES.CHINESE:
                return '中華';
            case MENU_CATEGORIES.DESSERT:
                return 'デザート';
            case MENU_CATEGORIES.OTHER:
                return 'その他';
            default:
                return category;
        }
    };

    const handleCategoryToggle = (category) => {
        setFormData(prev => {
            const selectedCategories = prev.selectedCategories || [];
            if (selectedCategories.includes(category)) {
                return {
                    ...prev,
                    selectedCategories: selectedCategories.filter(c => c !== category)
                };
            } else {
                return {
                    ...prev,
                    selectedCategories: [...selectedCategories, category]
                };
            }
        });
    };

    const showMessage = (message) => {
        setDialogMessage(message);
        setShowDialog(true);
        setDialogKey(prev => prev + 1);
    };

    const handleCloseDialog = React.useCallback(() => {
        setShowDialog(false);
        setDialogMessage('');
    }, []);

    const handleDialogClick = React.useCallback((e) => {
        if (e.target === e.currentTarget) {
            handleCloseDialog();
        }
    }, [handleCloseDialog]);

    React.useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && showDialog) {
                handleCloseDialog();
            }
        };

        if (showDialog) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [showDialog, handleCloseDialog]);

    const handleExportPDF = async () => {
        if (!scriptsLoaded) {
            showMessage('PDFライブラリの読み込み中です。しばらくお待ちください。');
            return;
        }

        if (!window.jspdf || !window.html2canvas) {
            showMessage('PDFライブラリが正しく読み込まれていません。ページを更新して再度お試しください。');
            return;
        }

        setIsExporting(true);
        let contentElement = null;
        let tempContainer = null;

        try {
            // メモリ使用量を最適化するため、画像サイズを制限
            const maxImageSize = 800; // ピクセル単位

            // フィルタリング条件を作成
            const selectedCategories = formData.selectedCategories || [];
            const filteredMenus = selectedCategories.length === 0 
                ? menus 
                : menus.filter(menu => selectedCategories.includes(menu.category));

            // 一時的なコンテナを作成
            tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '-9999px';
            document.body.appendChild(tempContainer);

            // PDF用のコンテンツを作成（画像サイズを制限）
            contentElement = document.createElement('div');
            contentElement.style.padding = '20px';
            contentElement.style.background = 'white';
            contentElement.style.width = '800px';
            contentElement.innerHTML = `
                <div style="background: url('${getBackgroundUrl()}') center/cover no-repeat; padding: 40px; min-height: 100%;">
                    <div style="background: rgba(255, 255, 255, 0.9); padding: 30px; border-radius: 12px;">
                        <h1 style="font-size: 24px; margin-bottom: 40px; text-align: center;">${settings.title}</h1>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                            ${filteredMenus.map(menu => `
                                <div style="border: 1px solid #ccc; padding: 15px; border-radius: 8px; background: white;">
                                    <h3 style="font-size: 18px; margin-bottom: 10px;">${menu.name}</h3>
                                    <p style="color: #666;">
                                        <strong>カテゴリ:</strong> ${getCategoryLabel(menu.category)}
                                    </p>
                                    ${menu.image ? `<img src="${menu.image}" style="width: 100%; max-width: ${maxImageSize}px; height: 150px; object-fit: cover; margin-top: 10px; border-radius: 4px;">` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            tempContainer.appendChild(contentElement);

            const canvas = await html2canvas(contentElement, {
                scale: 1.5, // スケールを下げてメモリ使用量を削減
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: null,
                imageTimeout: 15000, // タイムアウトを15秒に設定
                onclone: (clonedDoc) => {
                    // クローンされたドキュメントの画像読み込みを待機
                    const images = clonedDoc.getElementsByTagName('img');
                    return Promise.all(Array.from(images).map(img => {
                        if (img.complete) {
                            return Promise.resolve();
                        }
                        return new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = reject;
                        });
                    }));
                }
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.8); // 画質を80%に設定
            const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 30;

            pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`${settings.title}.pdf`);
            showMessage('PDFの保存が完了しました。');

        } catch (error) {
            console.error('PDF生成エラー:', error);
            showMessage('PDF生成中にエラーが発生しました。時間をおいて再度お試しください。');
        } finally {
            setIsExporting(false);
            if (tempContainer && document.body.contains(tempContainer)) {
                document.body.removeChild(tempContainer);
            }
        }
    };

    const handleBackgroundImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // ファイルサイズのチェック（5MB制限）
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                showMessage('画像ファイルのサイズが大きすぎます。5MB以下の画像を選択してください。');
                e.target.value = ''; // 入力をクリア
                return;
            }

            // 画像ファイルの種類をチェック
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                showMessage('対応していないファイル形式です。JPG、PNG、GIF形式の画像を選択してください。');
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                // 画像のサイズをチェック
                const img = new Image();
                img.onload = () => {
                    if (img.width > 2000 || img.height > 2000) {
                        showMessage('画像の解像度が高すぎます。2000px × 2000px以下の画像を選択してください。');
                        e.target.value = '';
                        return;
                    }
                    setFormData(prev => ({
                        ...prev,
                        customBackground: reader.result,
                        backgroundTheme: 'custom'
                    }));
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    // 背景画像のURLを取得する関数を修正
    const getBackgroundUrl = () => {
        if (formData.backgroundTheme === 'custom' && formData.customBackground) {
            return formData.customBackground;
        }
        const timestamp = new Date().getTime();
        const encodedTheme = encodeURIComponent(formData.backgroundTheme);
        return `https://source.unsplash.com/1600x900/?${encodedTheme}&t=${timestamp}`;
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">設定</h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="block text-lg font-medium text-gray-700">
                                タイトル
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-lg font-medium text-gray-700">
                                背景テーマ
                            </label>
                            <select
                                value={formData.backgroundTheme}
                                onChange={(e) => setFormData({ ...formData, backgroundTheme: e.target.value })}
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                            >
                                <option value={BACKGROUND_THEMES.FRENCH}>フレンチレストラン</option>
                                <option value={BACKGROUND_THEMES.JAPANESE}>和食レストラン</option>
                                <option value={BACKGROUND_THEMES.KITCHEN}>キッチン</option>
                                <option value={BACKGROUND_THEMES.CAFE}>カフェ</option>
                                <option value={BACKGROUND_THEMES.DINING}>ダイニング</option>
                                {formData.customBackground && <option value="custom">カスタム画像</option>}
                            </select>

                            <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <label className="block text-lg font-medium text-gray-700 mb-4">
                                    カスタム背景画像
                                </label>
                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif"
                                        onChange={handleBackgroundImageUpload}
                                        className="block w-full text-lg text-gray-500
                                            file:mr-4 file:py-3 file:px-6
                                            file:rounded-xl file:border-0
                                            file:text-lg file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100
                                            transition-all duration-200"
                                    />
                                    {formData.customBackground && (
                                        <div className="relative rounded-2xl overflow-hidden shadow-lg">
                                            <img
                                                src={formData.customBackground}
                                                alt="カスタム背景"
                                                className="w-full h-48 object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    customBackground: null,
                                                    backgroundTheme: BACKGROUND_THEMES.FRENCH
                                                }))}
                                                className="absolute top-3 right-3 p-2 bg-red-600/90 backdrop-blur-sm text-white rounded-xl hover:bg-red-700 
                                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                                                transition-all duration-200 transform hover:scale-105"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <label className="block text-lg font-medium text-gray-700 mb-4">
                                表示するカテゴリ
                                <span className="text-sm text-gray-500 ml-2">（未選択の場合は全て表示）</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.values(MENU_CATEGORIES).map(category => (
                                    <label key={category} className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200">
                                        <input
                                            type="checkbox"
                                            checked={formData.selectedCategories && formData.selectedCategories.includes(category)}
                                            onChange={() => handleCategoryToggle(category)}
                                            className="rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                                        />
                                        <span className="ml-3 text-lg">{getCategoryLabel(category)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between pt-6">
                            <button
                                type="button"
                                onClick={handleExportPDF}
                                disabled={isExporting || !scriptsLoaded}
                                className={`inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-xl text-white 
                                    ${isExporting || !scriptsLoaded ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} 
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                                    transition-all duration-200 transform hover:scale-105`}
                            >
                                {isExporting ? '生成中...' : 'PDF出力'}
                            </button>

                            <div className="space-x-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm 
                                        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                                        transition-all duration-200 transform hover:scale-105"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 text-lg font-medium text-white bg-blue-600 border border-transparent rounded-xl shadow-sm 
                                        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                        transition-all duration-200 transform hover:scale-105"
                                >
                                    保存
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {isExporting && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000]">
                    <div className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-2xl text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-700">PDFを生成中...</p>
                    </div>
                </div>
            )}

            {showDialog && (
                <div 
                    key={dialogKey}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000]"
                    onClick={handleDialogClick}
                >
                    <div 
                        className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4" 
                        onClick={e => e.stopPropagation()}
                    >
                        <p className="text-lg text-gray-700 mb-6 whitespace-pre-line">{dialogMessage}</p>
                        <button
                            onClick={handleCloseDialog}
                            className="w-full px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-xl 
                                hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500
                                transition-all duration-200 transform hover:scale-105"
                            style={{
                                WebkitTapHighlightColor: 'transparent',
                                touchAction: 'manipulation'
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}; 