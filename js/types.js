const MENU_CATEGORIES = {
    JAPANESE: 'japanese',
    WESTERN: 'western',
    CHINESE: 'chinese',
    DESSERT: 'dessert',
    OTHER: 'other'
};

const BACKGROUND_THEMES = {
    FRENCH: 'french,restaurant,interior',
    JAPANESE: 'japanese,restaurant,interior',
    KITCHEN: 'cooking,kitchen',
    CAFE: 'cafe,interior',
    DINING: 'dining,room'
};

// アプリケーション設定の初期値
const INITIAL_SETTINGS = {
    title: '家庭のメニュー表',
    backgroundTheme: BACKGROUND_THEMES.FRENCH
};

// メニューの初期データ
const INITIAL_MENUS = [
    {
        id: '1',
        name: 'ハンバーグ',
        description: '手作りデミグラスソースのジューシーなハンバーグ',
        category: MENU_CATEGORIES.WESTERN,
        image: null,
        ingredients: '牛ひき肉 300g, 玉ねぎ 1個, パン粉 1カップ, 牛乳 100ml, 塩コショウ 適量',
        lastCookedDate: '2024-03-20'
    },
    {
        id: '2',
        name: 'サラダ',
        description: '新鮮な野菜のミックスサラダ',
        category: MENU_CATEGORIES.WESTERN,
        image: null,
        ingredients: 'レタス 1個, トマト 2個, きゅうり 1本, ドレッシング 適量',
        lastCookedDate: '2024-03-21'
    }
]; 