const AddMenuForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        category: MENU_CATEGORIES.MAIN,
        image: null,
        ingredients: '',
        lastCookedDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
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
                    <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
                        材料（任意）
                    </label>
                    <textarea
                        id="ingredients"
                        rows={3}
                        placeholder="例: 玉ねぎ 1個, にんじん 2本..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.ingredients}
                        onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
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
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        画像（任意）
                    </label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="mt-1 block w-full"
                        onChange={handleImageChange}
                    />
                    {formData.image && (
                        <img
                            src={formData.image}
                            alt="プレビュー"
                            className="mt-2 h-48 w-full object-cover rounded-lg"
                        />
                    )}
                </div>

                <div>
                    <label htmlFor="lastCookedDate" className="block text-sm font-medium text-gray-700">
                        最終作成日（任意）
                    </label>
                    <input
                        type="date"
                        id="lastCookedDate"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.lastCookedDate}
                        onChange={(e) => setFormData({ ...formData, lastCookedDate: e.target.value })}
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