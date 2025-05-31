const AddMenuForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        category: MENU_CATEGORIES.MAIN,
        imageUrl: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
            <div className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        メニュー名
                    </label>
                    <input
                        type="text"
                        id="name"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        説明
                    </label>
                    <textarea
                        id="description"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        カテゴリー
                    </label>
                    <select
                        id="category"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value={MENU_CATEGORIES.MAIN}>メイン</option>
                        <option value={MENU_CATEGORIES.SIDE}>サイド</option>
                        <option value={MENU_CATEGORIES.SOUP}>スープ</option>
                        <option value={MENU_CATEGORIES.OTHER}>その他</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                        画像URL（任意）
                    </label>
                    <input
                        type="url"
                        id="imageUrl"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
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
    );
}; 