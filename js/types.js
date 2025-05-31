const MENU_CATEGORIES = {
    MAIN: 'main',
    SIDE: 'side',
    SOUP: 'soup',
    OTHER: 'other'
};

// メニューの初期データ
const INITIAL_MENUS = [
    {
        id: '1',
        name: 'ハンバーグ',
        description: '手作りデミグラスソースのジューシーなハンバーグ',
        category: MENU_CATEGORIES.MAIN,
        image: null,
        ingredients: '牛ひき肉 300g, 玉ねぎ 1個, パン粉 1カップ, 牛乳 100ml, 塩コショウ 適量',
        lastCookedDate: '2024-03-20'
    },
    {
        id: '2',
        name: 'サラダ',
        description: '新鮮な野菜のミックスサラダ',
        category: MENU_CATEGORIES.SIDE,
        image: null,
        ingredients: 'レタス 1個, トマト 2個, きゅうり 1本, ドレッシング 適量',
        lastCookedDate: '2024-03-21'
    }
]; 