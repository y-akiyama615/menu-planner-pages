// Firebaseのデータ操作関数
const FirebaseService = {
    // メニューの取得
    async getMenus(familyId) {
        try {
            const snapshot = await db.collection('families').doc(familyId).collection('menus').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('メニューの取得に失敗しました:', error);
            return [];
        }
    },

    // メニューの追加
    async addMenu(familyId, menuData) {
        try {
            const docRef = await db.collection('families').doc(familyId).collection('menus').add(menuData);
            return {
                id: docRef.id,
                ...menuData
            };
        } catch (error) {
            console.error('メニューの追加に失敗しました:', error);
            throw error;
        }
    },

    // メニューの更新
    async updateMenu(familyId, menuId, menuData) {
        try {
            await db.collection('families').doc(familyId).collection('menus').doc(menuId).update(menuData);
            return {
                id: menuId,
                ...menuData
            };
        } catch (error) {
            console.error('メニューの更新に失敗しました:', error);
            throw error;
        }
    },

    // メニューの削除
    async deleteMenu(familyId, menuId) {
        try {
            await db.collection('families').doc(familyId).collection('menus').doc(menuId).delete();
            return true;
        } catch (error) {
            console.error('メニューの削除に失敗しました:', error);
            throw error;
        }
    },

    // 画像のアップロード
    async uploadImage(familyId, file) {
        try {
            const storageRef = storage.ref();
            const imageRef = storageRef.child(`families/${familyId}/images/${Date.now()}_${file.name}`);
            await imageRef.put(file);
            return await imageRef.getDownloadURL();
        } catch (error) {
            console.error('画像のアップロードに失敗しました:', error);
            throw error;
        }
    },

    // 家族の作成
    async createFamily(familyName, userId) {
        try {
            const familyRef = await db.collection('families').add({
                name: familyName,
                createdBy: userId,
                members: [userId],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return familyRef.id;
        } catch (error) {
            console.error('家族の作成に失敗しました:', error);
            throw error;
        }
    },

    // 家族への参加
    async joinFamily(familyId, userId) {
        try {
            await db.collection('families').doc(familyId).update({
                members: firebase.firestore.FieldValue.arrayUnion(userId)
            });
            return true;
        } catch (error) {
            console.error('家族への参加に失敗しました:', error);
            throw error;
        }
    }
}; 