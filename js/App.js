const App = () => {
    const [menus, setMenus] = React.useState([]);
    const [isAddingMenu, setIsAddingMenu] = React.useState(false);
    const [selectedMenu, setSelectedMenu] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const [familyId, setFamilyId] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    // 認証状態の監視
    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // ユーザーのfamilyIdを取得
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    setFamilyId(userDoc.data().familyId);
                }
                setUser(user);
            } else {
                setUser(null);
                setFamilyId(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // メニューの取得
    React.useEffect(() => {
        if (familyId) {
            const loadMenus = async () => {
                const menuData = await FirebaseService.getMenus(familyId);
                setMenus(menuData);
            };
            loadMenus();
        }
    }, [familyId]);

    const handleLogin = async (userId, familyId) => {
        // ユーザー情報を保存
        await db.collection('users').doc(userId).set({
            familyId: familyId
        });
        setFamilyId(familyId);
    };

    const handleAddMenu = async (menuData) => {
        if (!familyId) return;
        const newMenu = await FirebaseService.addMenu(familyId, menuData);
        setMenus([...menus, newMenu]);
        setIsAddingMenu(false);
    };

    const handleUpdateMenu = async (updatedMenu) => {
        if (!familyId) return;
        await FirebaseService.updateMenu(familyId, updatedMenu.id, updatedMenu);
        setMenus(menus.map(menu => menu.id === updatedMenu.id ? updatedMenu : menu));
        setSelectedMenu(null);
    };

    const handleDeleteMenu = async (menuId) => {
        if (!familyId) return;
        await FirebaseService.deleteMenu(familyId, menuId);
        setMenus(menus.filter(menu => menu.id !== menuId));
        setSelectedMenu(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">読み込み中...</p>
            </div>
        );
    }

    if (!user) {
        return <Auth onLogin={handleLogin} />;
    }

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
                                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                                        <button
                                            onClick={() => auth.signOut()}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                        >
                                            ログアウト
                                        </button>
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