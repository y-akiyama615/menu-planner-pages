const App = () => {
    const [menus, setMenus] = React.useState(() => {
        const savedMenus = localStorage.getItem('menus');
        return savedMenus ? JSON.parse(savedMenus) : [
            {
                id: '1',
                name: 'ハンバーグ',
                description: '手作りデミグラスソースのジューシーなハンバーグ',
                category: MENU_CATEGORIES.MAIN,
                imageUrl: 'https://source.unsplash.com/featured/?hamburger',
            },
            {
                id: '2',
                name: 'サラダ',
                description: '新鮮な野菜のミックスサラダ',
                category: MENU_CATEGORIES.SIDE,
                imageUrl: 'https://source.unsplash.com/featured/?salad',
            },
        ];
    });

    const [isAddingMenu, setIsAddingMenu] = React.useState(false);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    {!isAddingMenu ? (
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
                                <MenuList items={menus} onAddClick={() => setIsAddingMenu(true)} />
                            </div>
                        </React.Fragment>
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />); 