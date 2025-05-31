const Settings = ({ settings, onSave, onClose, menus }) => {
    const [formData, setFormData] = React.useState({
        ...settings,
        selectedCategories: settings.selectedCategories || []
    });
    const [isExporting, setIsExporting] = React.useState(false);
    const [showDialog, setShowDialog] = React.useState(false);
    const [dialogMessage, setDialogMessage] = React.useState('');

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
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        let contentElement = null;

        try {
            await Promise.all([
                new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                }),
                new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                })
            ]);

            contentElement = document.createElement('div');
            contentElement.style.padding = '20px';
            contentElement.style.background = 'white';
            contentElement.style.width = '800px';
            contentElement.style.position = 'absolute';
            contentElement.style.left = '-9999px';
            contentElement.innerHTML = `
                <h1 style="font-size: 24px; margin-bottom: 40px; text-align: center;">${settings.title}</h1>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                    ${menus
                        .filter(menu => !formData.selectedCategories?.length || formData.selectedCategories.includes(menu.category))
                        .map(menu => `
                            <div style="border: 1px solid #ccc; padding: 15px; border-radius: 8px;">
                                <h3 style="font-size: 18px; margin-bottom: 10px;">${menu.name}</h3>
                                <p style="color: #666;">
                                    <strong>カテゴリ:</strong> ${getCategoryLabel(menu.category)}
                                </p>
                                ${menu.imageUrl ? `<img src="${menu.imageUrl}" style="width: 100%; height: 150px; object-fit: cover; margin-top: 10px; border-radius: 4px;">` : ''}
                            </div>
                        `).join('')}
                </div>
            `;

            document.body.appendChild(contentElement);

            try {
                const canvas = await html2canvas(contentElement, {
                    scale: 2,
                    useCORS: true,
                    logging: false
                });

                if (contentElement && contentElement.parentNode) {
                    contentElement.parentNode.removeChild(contentElement);
                }

                const imgData = canvas.toDataURL('image/jpeg', 1.0);
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
                showMessage('PDF生成中にエラーが発生しました。');
            }
        } catch (error) {
            console.error('スクリプトロードエラー:', error);
            showMessage('必要なライブラリの読み込みに失敗しました。');
        } finally {
            setIsExporting(false);
            // 念のため、要素が残っている場合は削除
            if (contentElement && contentElement.parentNode) {
                contentElement.parentNode.removeChild(contentElement);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                背景テーマ
                            </label>
                            <select
                                value={formData.backgroundTheme}
                                onChange={(e) => setFormData({ ...formData, backgroundTheme: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value={BACKGROUND_THEMES.FRENCH}>フレンチレストラン</option>
                                <option value={BACKGROUND_THEMES.JAPANESE}>和食レストラン</option>
                                <option value={BACKGROUND_THEMES.KITCHEN}>キッチン</option>
                                <option value={BACKGROUND_THEMES.CAFE}>カフェ</option>
                                <option value={BACKGROUND_THEMES.DINING}>ダイニング</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                表示するカテゴリ（未選択の場合は全て表示）
                            </label>
                            <div className="space-y-2">
                                {Object.values(MENU_CATEGORIES).map(category => (
                                    <label key={category} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.selectedCategories?.includes(category)}
                                            onChange={() => handleCategoryToggle(category)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                        />
                                        {getCategoryLabel(category)}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleExportPDF}
                                disabled={isExporting}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                                    isExporting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-700">PDFを生成中...</p>
                    </div>
                </div>
            )}

            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <p className="text-gray-700 mb-4 whitespace-pre-line">{dialogMessage}</p>
                        <button
                            onClick={() => setShowDialog(false)}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}; 