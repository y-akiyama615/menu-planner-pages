const MenuList = ({ items, onAddClick, onItemClick }) => {
    const getCategoryLabel = (category) => {
        switch (category) {
            case MENU_CATEGORIES.JAPANESE:
                return '和食';
            case MENU_CATEGORIES.WESTERN:
                return '洋食';
            case MENU_CATEGORIES.CHINESE:
                return '中華';
            case MENU_CATEGORIES.DESSERT:
                return 'デザート';
            case MENU_CATEGORIES.OTHER:
                return 'その他';
            default:
                return category;
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {items.map((item) => (
                <div
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                >
                    <div className="relative h-48">
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No image</span>
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                {getCategoryLabel(item.category)}
                            </span>
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                        <p className="text-gray-600">{item.description}</p>
                        {item.lastCookedDate && (
                            <p className="text-sm text-gray-500 mt-2">
                                最終作成日: {item.lastCookedDate}
                            </p>
                        )}
                    </div>
                </div>
            ))}
            <div
                onClick={onAddClick}
                className="cursor-pointer flex items-center justify-center bg-white rounded-lg shadow-lg h-full min-h-[300px] border-2 border-dashed border-gray-300 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
                <div className="text-center">
                    <div className="text-4xl text-gray-400 mb-2">+</div>
                    <span className="text-gray-600">新しいメニューを追加</span>
                </div>
            </div>
        </div>
    );
}; 