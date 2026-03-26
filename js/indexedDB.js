const DB_NAME = "NarvaroDB";

// Connection cache for better performance
let cachedDB = null;

// Dynamically get current store name based on localStorage
function getStoreName() {
  const year = localStorage.getItem("storedYear");
  const month = localStorage.getItem("storedMonth");
  const date = new Date(year, month);
  return `${date.toLocaleString("sv-SE", { month: "long" })} ${year}`;
}

// Get or increment the DB version counter
function getNextDBVersion() {
  let version = localStorage.getItem("dbVersion") || 1;
  version++;
  localStorage.setItem("dbVersion", version);
  return version;
}

async function openDB(makeDB = false) {
  // If trying to create DB and cache is open, close it
  if (makeDB && cachedDB) {
    cachedDB.close();
    cachedDB = null;
  }

  // Return cached connection if available and not creating
  if (cachedDB && !makeDB) {
    return cachedDB;
  }

  return new Promise((resolve, reject) => {
    const storeName = getStoreName();
    
    // Get version - if creating, get next version; otherwise use current
    const version = makeDB ? getNextDBVersion() : undefined;
    const request = version ? indexedDB.open(DB_NAME, version) : indexedDB.open(DB_NAME);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (makeDB && !db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, {
          keyPath: "name"
        });
      }
    };

    request.onsuccess = () => {
      const resultDB = request.result;
      cachedDB = resultDB;
      resolve(resultDB);
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function saveData(dataArray) {
  const db = await openDB(true);
  const storeName = getStoreName();
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);

  dataArray.forEach(item => {
    // Handle the group object (no "name")
    if (!item.name && item.name_Group) {
      store.put({
        name: "name_Group",
        name_Group: item.name_Group
      });
    } else {
      store.put(item);
    }
  });

  return tx.complete;
}

async function getAllNarvaroDBNames() {
  const db = await openDB(false);
  let names = [];
  for (let i = 0; i < db.objectStoreNames.length; i++) {
    names.push(db.objectStoreNames[i]);
  }
  return names;
}

async function getAllNarvaro() {
  const db = await openDB(false);

  return new Promise((resolve, reject) => {
    const allData = [];
    const storeCount = db.objectStoreNames.length;
    let completedStores = 0;

    if (storeCount === 0) {
      resolve([]);
      return;
    }

    // Query all stores in parallel
    for (let i = 0; i < storeCount; i++) {
      const tx = db.transaction(db.objectStoreNames[i], "readonly");
      const store = tx.objectStore(db.objectStoreNames[i]);
      const request = store.getAll();

      request.onsuccess = () => {
        allData.push(...request.result);
        completedStores++;
        
        // Resolve when all stores are complete
        if (completedStores === storeCount) {
          resolve(allData);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    }
  });
}

async function getNarvaro(name) {
  const db = await openDB(false);

  return new Promise((resolve, reject) => {
      const tx = db.transaction(name, "readonly");
      const store = tx.objectStore(name);
      const request = store.getAll();

      request.onsuccess = () => {
        const students = request.result;
        resolve(students);
      };

      request.onerror = (err) => {
        reject(err);
      };
    });
}

async function removeDB() {
    const db = await openDB(false);
    
    db.close();
    
    return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    clearDBCache();
    
    request.onsuccess = () => {
      console.log("IndexedDB deleted");
      resolve(true);
    };

    request.onerror = () => {
      console.error("Failed to delete IndexedDB", request.error);
      reject(request.error);
    };

    request.onblocked = () => {
      console.warn("Delete blocked: another tab or connection is open");
    };
  });
}

// Clear the connection cache when STORE_NAME changes
function clearDBCache() {
  if (cachedDB) {
    cachedDB.close();
    cachedDB = null;
    dbVersion = null;
  }
}
