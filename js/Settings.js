const Settings = ({ settings, onSave, onClose, menus }) => {
    const [formData, setFormData] = React.useState({
        ...settings,
        selectedCategories: settings.selectedCategories || [],
        customBackground: settings.customBackground || null,
        customTopBackground: settings.customTopBackground || null
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
            contentElement.style.fontFamily = 'Helvetica, Arial, sans-serif';

            // 背景画像URL
            const menuBackgroundImageUrl = formData.customBackground
                ? formData.customBackground
                : 'https://source.unsplash.com/1600x900/?french,restaurant,elegant';

            const topBackgroundImageUrl = formData.customTopBackground
                ? formData.customTopBackground
                : 'https://source.unsplash.com/1600x900/?french,restaurant,luxury';

            contentElement.innerHTML = `
                <div style="
                    background: linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), 
                    url('${topBackgroundImageUrl}') center/cover no-repeat; 
                    padding: 40px 40px 60px; 
                    min-height: 100%;
                    font-family: Helvetica, Arial, sans-serif;
                ">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="
                            font-size: 32px; 
                            color: #2c3e50;
                            font-family: Helvetica, Arial, sans-serif;
                            margin-bottom: 10px;
                            letter-spacing: 1px;
                        ">${settings.title}</h1>
                        <div style="
                            width: 60px;
                            height: 3px;
                            background: #e67e22;
                            margin: 0 auto;
                        "></div>
                    </div>
                    <div style="
                        background: linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), 
                        url('${menuBackgroundImageUrl}') center/cover no-repeat;
                        padding: 30px;
                        border-radius: 12px;
                    ">
                        <div style="
                            display: grid; 
                            grid-template-columns: repeat(2, 1fr); 
                            gap: 25px;
                            font-family: Helvetica, Arial, sans-serif;
                        ">
                            ${filteredMenus.map(menu => `
                                <div style="
                                    border: 1px solid #e1e1e1;
                                    padding: 20px;
                                    border-radius: 8px;
                                    background: white;
                                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                                ">
                                    <h3 style="
                                        font-size: 20px;
                                        margin-bottom: 12px;
                                        color: #2c3e50;
                                        font-family: Helvetica, Arial, sans-serif;
                                    ">${menu.name}</h3>
                                    <p style="
                                        color: #666;
                                        font-size: 14px;
                                        margin-bottom: 15px;
                                        font-family: Helvetica, Arial, sans-serif;
                                    ">
                                        <strong>カテゴリ:</strong> ${getCategoryLabel(menu.category)}
                                    </p>
                                    ${menu.image ? `
                                        <div style="
                                            width: 100%;
                                            height: 150px;
                                            overflow: hidden;
                                            border-radius: 4px;
                                            margin-top: 10px;
                                        ">
                                            <img 
                                                src="${menu.image}" 
                                                style="
                                                    width: 100%;
                                                    height: 100%;
                                                    object-fit: cover;
                                                "
                                            >
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            tempContainer.appendChild(contentElement);

            const canvas = await html2canvas(contentElement, {
                scale: 1.5,
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: null,
                imageTimeout: 15000,
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

            const imgData = canvas.toDataURL('image/jpeg', 0.8);
            const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
            
            // フォントを設定
            pdf.setFont('helvetica');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10; // 上部の余白を10mmに変更

            pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`${settings.title}.pdf`);
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

    const handleBackgroundImageUpload = (e, type = 'menu') => {
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
                        ...(type === 'menu' 
                            ? { customBackground: reader.result }
                            : { customTopBackground: reader.result })
                    }));
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-90 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">設定</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                タイトル
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-md">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    トップページの背景画像
                                </label>
                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif"
                                        onChange={(e) => handleBackgroundImageUpload(e, 'top')}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                    />
                                    {formData.customTopBackground && (
                                        <div className="relative">
                                            <img
                                                src={formData.customTopBackground}
                                                alt="トップページの背景"
                                                className="w-full h-40 object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    customTopBackground: null
                                                }))}
                                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-md">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    メニュー一覧の背景画像
                                </label>
                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif"
                                        onChange={(e) => handleBackgroundImageUpload(e, 'menu')}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                    />
                                    {formData.customBackground && (
                                        <div className="relative">
                                            <img
                                                src={formData.customBackground}
                                                alt="メニュー一覧の背景"
                                                className="w-full h-40 object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    customBackground: null
                                                }))}
                                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-md">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                表示するカテゴリ
                                <span className="text-sm text-gray-500 ml-2">（未選択の場合は全て表示）</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.values(MENU_CATEGORIES).map(category => (
                                    <label key={category} className="flex items-center p-3 bg-white rounded-md border border-gray-200">
                                        <input
                                            type="checkbox"
                                            checked={formData.selectedCategories && formData.selectedCategories.includes(category)}
                                            onChange={() => handleCategoryToggle(category)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                        />
                                        {getCategoryLabel(category)}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <button
                                type="button"
                                onClick={handleExportPDF}
                                disabled={isExporting || !scriptsLoaded}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                                    isExporting || !scriptsLoaded ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                            >
                                {isExporting ? '生成中...' : 'PDF出力'}
                            </button>

                            <div className="space-x-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                                >
                                    保存
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {isExporting && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[10000]">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-700">PDFを生成中...</p>
                    </div>
                </div>
            )}

            {showDialog && (
                <div 
                    key={dialogKey}
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[10000] overflow-y-auto"
                    onClick={handleDialogClick}
                >
                    <div 
                        className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 my-8" 
                        onClick={e => e.stopPropagation()}
                    >
                        <p className="text-gray-700 mb-4 whitespace-pre-line">{dialogMessage}</p>
                        <button
                            onClick={handleCloseDialog}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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