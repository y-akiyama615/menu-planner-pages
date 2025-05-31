const App = () => {
    const [menus, setMenus] = React.useState(() => {
        const savedMenus = localStorage.getItem('menus');
        return savedMenus ? JSON.parse(savedMenus) : INITIAL_MENUS;
    });

    const [isAddingMenu, setIsAddingMenu] = React.useState(false);
    const [selectedMenu, setSelectedMenu] = React.useState(null);

    React.useEffect(() => {
        localStorage.setItem('menus', JSON.stringify(menus));
    }, [menus]);

    const handleAddMenu = (menuData) => {
        const newMenu = {
            ...menuData,
            id: Date.now().toString(),
        };
        setMenus([...menus, newMenu]);
        setIsAddingMenu(false);
    };

    const handleUpdateMenu = (updatedMenu) => {
        setMenus(menus.map(menu => menu.id === updatedMenu.id ? updatedMenu : menu));
        setSelectedMenu(null);
    };

    const handleDeleteMenu = (menuId) => {
        setMenus(menus.filter(menu => menu.id !== menuId));
        setSelectedMenu(null);
    };

    return (
        <div className="min-h-screen bg-[url('https://source.unsplash.com/featured/?french,restaurant,interior')] bg-cover bg-center bg-fixed">
            <div className="min-h-screen bg-white/90 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto py-6">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {!isAddingMenu && !selectedMenu ? (
                            <React.Fragment>
                                <div className="sm:flex sm:items-center">
                                    <div className="sm:flex-auto">
                                        <h1 className="text-3xl font-semibold text-gray-900">家庭のメニュー表</h1>
                                        <p className="mt-2 text-sm text-gray-700">
                                            家族で共有する料理メニューの一覧です。新しいメニューを追加して、バリエーションを増やしましょう。
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <MenuList
                                        items={menus}
                                        onAddClick={() => setIsAddingMenu(true)}
                                        onItemClick={setSelectedMenu}
                                    />
                                </div>
                            </React.Fragment>
                        ) : isAddingMenu ? (
                            <React.Fragment>
                                <div className="mb-8">
                                    <h1 className="text-3xl font-semibold text-gray-900">新しいメニューを追加</h1>
                                    <p className="mt-2 text-sm text-gray-700">
                                        新しい料理メニューの情報を入力してください。
                                    </p>
                                </div>
                                <AddMenuForm
                                    onSubmit={handleAddMenu}
                                    onCancel={() => setIsAddingMenu(false)}
                                />
                            </React.Fragment>
                        ) : selectedMenu && (
                            <MenuDetail
                                menu={selectedMenu}
                                onClose={() => setSelectedMenu(null)}
                                onSave={handleUpdateMenu}
                                onDelete={() => handleDeleteMenu(selectedMenu.id)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />); 