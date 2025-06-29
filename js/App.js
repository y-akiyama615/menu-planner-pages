const App = () => {
    const [menus, setMenus] = React.useState(() => {
        const savedMenus = localStorage.getItem('menus');
        return savedMenus ? JSON.parse(savedMenus) : INITIAL_MENUS;
    });

    const [settings, setSettings] = React.useState(() => {
        const savedSettings = localStorage.getItem('settings');
        return savedSettings ? JSON.parse(savedSettings) : INITIAL_SETTINGS;
    });

    const [isAddingMenu, setIsAddingMenu] = React.useState(false);
    const [selectedMenu, setSelectedMenu] = React.useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

    React.useEffect(() => {
        localStorage.setItem('menus', JSON.stringify(menus));
    }, [menus]);

    React.useEffect(() => {
        localStorage.setItem('settings', JSON.stringify(settings));
    }, [settings]);

    // 背景画像のURLを生成
    const getBackgroundUrl = () => {
        const timestamp = new Date().getTime(); // キャッシュ回避用
        const encodedTheme = encodeURIComponent(settings.backgroundTheme);
        return `https://source.unsplash.com/1600x900/?${encodedTheme}&t=${timestamp}`;
    };

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

    const handleUpdateSettings = (newSettings) => {
        setSettings(newSettings);
        setIsSettingsOpen(false);
    };

    // フィルタリングされたメニューを取得
    const filteredMenus = React.useMemo(() => {
        if (!settings.selectedCategories || settings.selectedCategories.length === 0) {
            return menus;
        }
        return menus.filter(menu => settings.selectedCategories.includes(menu.category));
    }, [menus, settings.selectedCategories]);

    return (
        <div 
            className="min-h-screen relative"
            style={{
                backgroundImage: `url('${getBackgroundUrl()}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {!selectedMenu && !isAddingMenu && (
                <div className="fixed top-0 right-0 m-4 z-[9999]">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-lg backdrop-blur-sm"
                        style={{
                            position: 'fixed',
                            top: '16px',
                            right: '16px',
                            WebkitTransform: 'translateZ(0)',
                        }}
                    >
                        ⚙️ 設定
                    </button>
                </div>
            )}

            <div className="min-h-screen bg-white/90 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto py-6">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {!isAddingMenu && !selectedMenu ? (
                            <React.Fragment>
                                <div className="sm:flex sm:items-center">
                                    <div className="sm:flex-auto">
                                        <h1 className="text-3xl font-semibold text-gray-900">{settings.title}</h1>
                                        <p className="mt-2 text-sm text-gray-700">
                                            家族で共有する料理メニューの一覧です。新しいメニューを追加して、バリエーションを増やしましょう。
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <MenuList
                                        items={filteredMenus}
                                        onAddClick={() => setIsAddingMenu(true)}
                                        onItemClick={setSelectedMenu}
                                    />
                                </div>
                            </React.Fragment>
                        ) : (
                            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm overflow-y-auto z-[999]">
                                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                    {isAddingMenu ? (
                                        <div>
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
                                        </div>
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
                        )}
                    </div>
                </div>
            </div>
            {isSettingsOpen && (
                <Settings
                    settings={settings}
                    menus={menus}
                    onSave={handleUpdateSettings}
                    onClose={() => setIsSettingsOpen(false)}
                />
            )}
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />); 