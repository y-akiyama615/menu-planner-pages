const Auth = ({ onLogin }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [familyId, setFamilyId] = React.useState('');
    const [familyName, setFamilyName] = React.useState('');
    const [isNewFamily, setIsNewFamily] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // ログインまたはサインアップ
            let userCredential;
            try {
                userCredential = await auth.signInWithEmailAndPassword(email, password);
            } catch (error) {
                if (error.code === 'auth/user-not-found') {
                    userCredential = await auth.createUserWithEmailAndPassword(email, password);
                } else {
                    throw error;
                }
            }

            const userId = userCredential.user.uid;

            // 家族の処理
            let finalFamilyId = familyId;
            if (isNewFamily) {
                finalFamilyId = await FirebaseService.createFamily(familyName, userId);
            } else if (familyId) {
                await FirebaseService.joinFamily(familyId, userId);
            }

            onLogin(userId, finalFamilyId);
        } catch (error) {
            console.error('認証エラー:', error);
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        家庭のメニュー表にログイン
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">メールアドレス</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="メールアドレス"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">パスワード</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="パスワード"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="new-family"
                            name="new-family"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={isNewFamily}
                            onChange={(e) => setIsNewFamily(e.target.checked)}
                        />
                        <label htmlFor="new-family" className="ml-2 block text-sm text-gray-900">
                            新しい家族を作成
                        </label>
                    </div>

                    {isNewFamily ? (
                        <div>
                            <label htmlFor="family-name" className="sr-only">家族名</label>
                            <input
                                id="family-name"
                                name="family-name"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="家族名"
                                value={familyName}
                                onChange={(e) => setFamilyName(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="family-id" className="sr-only">家族ID</label>
                            <input
                                id="family-id"
                                name="family-id"
                                type="text"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="家族ID（任意）"
                                value={familyId}
                                onChange={(e) => setFamilyId(e.target.value)}
                            />
                        </div>
                    )}

                    {error && (
                        <div className="text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            ログイン / 新規登録
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 