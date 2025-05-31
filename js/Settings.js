const Settings = ({ settings, onSave, onClose }) => {
    const [formData, setFormData] = React.useState(settings);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleExportPDF = async () => {
        // jsPDFとhtml2canvasをCDNから動的にロード
        const jsPDFScript = document.createElement('script');
        jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        const html2canvasScript = document.createElement('script');
        html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';

        Promise.all([
            new Promise(resolve => jsPDFScript.onload = resolve),
            new Promise(resolve => html2canvasScript.onload = resolve)
        ]).then(() => {
            // メニュー一覧のHTMLを生成
            const content = document.createElement('div');
            content.style.padding = '20px';
            content.style.background = 'white';
            content.innerHTML = `
                <h1 style="font-size: 24px; margin-bottom: 20px;">${settings.title}</h1>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                    ${menus.map(menu => `
                        <div style="border: 1px solid #ccc; padding: 15px; border-radius: 8px;">
                            <h3 style="font-size: 18px; margin-bottom: 10px;">${menu.name}</h3>
                            <p style="color: #666;">${menu.description}</p>
                            <p style="margin-top: 10px;">
                                <strong>カテゴリ:</strong> ${getCategoryLabel(menu.category)}<br>
                                <strong>材料:</strong> ${menu.ingredients}<br>
                                <strong>最終作成日:</strong> ${menu.lastCookedDate}
                            </p>
                        </div>
                    `).join('')}
                </div>
            `;

            document.body.appendChild(content);

            // PDF生成
            html2canvas(content).then(canvas => {
                document.body.removeChild(content);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = 30;

                pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                pdf.save(`${settings.title}.pdf`);
            });
        });

        document.head.appendChild(jsPDFScript);
        document.head.appendChild(html2canvasScript);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
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

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleExportPDF}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                メニュー一覧をPDF出力
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
        </div>
    );
}; 