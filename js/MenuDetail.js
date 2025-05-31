const MenuDetail = ({ menu, onClose, onSave, onDelete }) => {
    const [editMode, setEditMode] = React.useState(false);
    const [editedMenu, setEditedMenu] = React.useState(menu);

    const handleSave = (e) => {
        e.preventDefault();
        onSave(editedMenu);
        setEditMode(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedMenu({ ...editedMenu, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {editMode ? (
                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">メニュー名</label>
                                <input
                                    type="text"
                                    value={editedMenu.name}
                                    onChange={(e) => setEditedMenu({ ...editedMenu, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">説明</label>
                                <textarea
                                    value={editedMenu.description}
                                    onChange={(e) => setEditedMenu({ ...editedMenu, description: e.target.value })}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">材料</label>
                                <textarea
                                    value={editedMenu.ingredients}
                                    onChange={(e) => setEditedMenu({ ...editedMenu, ingredients: e.target.value })}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">カテゴリー</label>
                                <select
                                    value={editedMenu.category}
                                    onChange={(e) => setEditedMenu({ ...editedMenu, category: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value={MENU_CATEGORIES.MAIN}>メイン</option>
                                    <option value={MENU_CATEGORIES.SIDE}>サイド</option>
                                    <option value={MENU_CATEGORIES.SOUP}>スープ</option>
                                    <option value={MENU_CATEGORIES.OTHER}>その他</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">画像</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1 block w-full"
                                />
                                {editedMenu.image && (
                                    <img
                                        src={editedMenu.image}
                                        alt={editedMenu.name}
                                        className="mt-2 h-48 w-full object-cover rounded-lg"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">最終作成日</label>
                                <input
                                    type="date"
                                    value={editedMenu.lastCookedDate}
                                    onChange={(e) => setEditedMenu({ ...editedMenu, lastCookedDate: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setEditMode(false)}
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
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-bold text-gray-900">{menu.name}</h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        編集
                                    </button>
                                    <button
                                        onClick={onDelete}
                                        className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>

                            {menu.image && (
                                <img
                                    src={menu.image}
                                    alt={menu.name}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            )}

                            <div>
                                <h3 className="text-lg font-medium text-gray-900">説明</h3>
                                <p className="mt-1 text-gray-600">{menu.description}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900">材料</h3>
                                <p className="mt-1 text-gray-600">{menu.ingredients}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900">カテゴリー</h3>
                                <span className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {menu.category}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900">最終作成日</h3>
                                <p className="mt-1 text-gray-600">{menu.lastCookedDate}</p>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                >
                                    閉じる
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 