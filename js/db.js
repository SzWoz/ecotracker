export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("EcoTrackerDB", 1);

    request.onerror = () => reject("Błąd otwierania bazy");
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      const store = db.createObjectStore("activities", {
        keyPath: "id",
        autoIncrement: true,
      });
      store.createIndex("date", "date", { unique: false });
    };
  });
};

export const saveActivity = async (activity) => {
  const db = await openDB();
  const tx = db.transaction("activities", "readwrite");
  const store = tx.objectStore("activities");
  store.add(activity);
  return tx.complete;
};

export const getAllActivities = async () => {
  const db = await openDB();
  const tx = db.transaction("activities", "readonly");
  const store = tx.objectStore("activities");
  const all = store.getAll();
  return new Promise((resolve, reject) => {
    all.onerror = () => reject(all.error);
    all.onsuccess = () => resolve(all.result);
  });
};
