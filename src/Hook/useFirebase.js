import { getDatabase, ref as refRealtime, query, equalTo, get, remove, set } from 'firebase/database'
import app from '../Config/FirebaseConfig'

export default async function UpdateIsSeenToTrueForManager(newValue) {

    const db = getDatabase(app) 
        const recordsRef = refRealtime(db, 'managerNoti')
        const snapshot = await get(recordsRef)
        snapshot.forEach((childSnapshot) => {
            const record = childSnapshot.val();
            if (record.requestId === newValue.id) {
                const recordRef = refRealtime(db, `managerNoti/${childSnapshot.key}`);
                set(recordRef, { ...record, isSeen: true }) 
                    .then(() => {
                      
                    })
                    .catch((error) => {
                      
                    });
            }
        })
}
export  async function UpdateIsSeenToTrueForEmployee(newValue) {

    const db = getDatabase(app) 
        const recordsRef = refRealtime(db, 'employeeNoti')
        const snapshot = await get(recordsRef)
        snapshot.forEach((childSnapshot) => {
            const record = childSnapshot.val();
            if (record.requestId === newValue.id) {
                const recordRef = refRealtime(db, `employeeNoti/${childSnapshot.key}`);
                set(recordRef, { ...record, isSeen: true }) 
                    .then(() => {
                      
                    })
                    .catch((error) => {
                      
                    });
            }
        })
}