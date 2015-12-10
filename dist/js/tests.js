// Generated by CoffeeScript 1.9.2
(function() {
  var $, TEST_ARRAY, TEST_OBJECT, _, rxStorage, storages, testPrefix;

  $ = window.$, _ = window._, rxStorage = window.rxStorage;

  testPrefix = "reactive__storage__test__";

  storages = ["local", "session"];

  TEST_OBJECT = {
    name: "name",
    array: [1, 2, 3],
    object: {
      a: 'a',
      b: 'b'
    }
  };

  TEST_ARRAY = [
    1, 2, [
      3, 4, {
        name: 'name'
      }
    ]
  ];

  storages.forEach(function(storage) {
    var curRxStorage, emptyState, testKey, windowStorage;
    testKey = function(k) {
      return "" + testPrefix + storage + "__" + k;
    };
    windowStorage = window[storage + "Storage"];
    curRxStorage = rxStorage[storage];
    curRxStorage.clear();
    emptyState = {};
    emptyState[window.rxStorage.__storageTypeKey] = storage;
    QUnit.test(storage + ".addString", function(assert) {
      var k;
      k = testKey("addString");
      curRxStorage.setItem(k, "value");
      assert.strictEqual(curRxStorage.getItem(k), "value");
      return assert.strictEqual(windowStorage[k], "value");
    });
    QUnit.test(storage + ".addJSON", function(assert) {
      var k;
      k = testKey("addJSON");
      curRxStorage.setItem(k, TEST_OBJECT);
      assert.propEqual(curRxStorage.getItem(k), TEST_OBJECT);
      return assert.strictEqual(windowStorage[rxStorage.__jsonPrefix(k)], JSON.stringify(TEST_OBJECT));
    });
    QUnit.test(storage + ".addNumber", function(assert) {
      var k1, k2, k3;
      k1 = testKey('addInt');
      k2 = testKey('addInt.0');
      k3 = testKey('addFloat');
      curRxStorage.setItem(k1, 42);
      curRxStorage.setItem(k2, 42.000);
      curRxStorage.setItem(k3, 42.5);
      assert.strictEqual(curRxStorage.getItem(k1), 42);
      assert.strictEqual(curRxStorage.getItem(k2), 42);
      assert.strictEqual(curRxStorage.getItem(k3), 42.5);
      assert.strictEqual(windowStorage[rxStorage.__numberPrefix(k1)], "42");
      assert.strictEqual(windowStorage[rxStorage.__numberPrefix(k2)], "42");
      return assert.strictEqual(windowStorage[rxStorage.__numberPrefix(k3)], "42.5");
    });
    QUnit.test(storage + ".addNull", function(assert) {
      var k;
      k = testKey('addNull');
      curRxStorage.setItem(k, null);
      assert.strictEqual(curRxStorage.getItem(k), null);
      return assert.strictEqual(windowStorage[rxStorage.__nullPrefix(k)], "null");
    });
    QUnit.test(storage + ".removeNull", function(assert) {
      var k;
      k = testKey('addNull');
      curRxStorage.setItem(k, null);
      curRxStorage.removeItem(k);
      assert.strictEqual(curRxStorage.getItem(k), void 0);
      return assert.strictEqual(windowStorage[rxStorage.__nullPrefix(k)], void 0);
    });
    QUnit.test(storage + ".clear", function(assert) {
      var k1, k2;
      k1 = testKey("clearString");
      k2 = testKey("clearJSON");
      curRxStorage.setItem(k1, "str");
      curRxStorage.setItem(k2, TEST_OBJECT);
      curRxStorage.clear();
      assert.strictEqual(curRxStorage.getItem(k1), void 0);
      assert.strictEqual(curRxStorage.getItem(k2), void 0);
      return assert.propEqual(windowStorage, emptyState);
    });
    QUnit.test(storage + ".removeString", function(assert) {
      var k;
      k = testKey("removeString");
      curRxStorage.setItem(k, "str");
      curRxStorage.removeItem(k);
      assert.strictEqual(curRxStorage.getItem(k), void 0);
      return assert.propEqual(windowStorage, emptyState);
    });
    QUnit.test(storage + ".removeJSON", function(assert) {
      var k;
      k = testKey("removeJSON");
      curRxStorage.setItem(k, TEST_OBJECT);
      curRxStorage.removeItem(k);
      assert.strictEqual(curRxStorage.getItem(k), void 0);
      return assert.propEqual(windowStorage, emptyState);
    });
    QUnit.test(storage + ".getMissingKey", function(assert) {
      return assert.strictEqual(curRxStorage.getItem(testKey("badkey")), void 0);
    });
    QUnit.test(storage + ".bind", function(assert) {
      var depCell, k, snapAssert;
      k = testKey("bind");
      depCell = curRxStorage.getItemBind(k);
      snapAssert = function(func, val) {
        return assert[func](rx.snap(function() {
          return depCell.get();
        }), val);
      };
      assert.strictEqual(rx.snap(function() {
        return depCell.get();
      }), void 0);
      curRxStorage.setItem(k, "bindstring");
      snapAssert("strictEqual", "bindstring");
      curRxStorage.setItem(k, TEST_OBJECT);
      snapAssert("deepEqual", TEST_OBJECT);
      curRxStorage.setItem(k, 42.5);
      snapAssert("strictEqual", 42.5);
      curRxStorage.setItem(k, null);
      snapAssert("strictEqual", null);
      curRxStorage.setItem(k, TEST_ARRAY);
      snapAssert("deepEqual", TEST_ARRAY);
      curRxStorage.setItem(k, 42);
      snapAssert("strictEqual", 42);
      curRxStorage.removeItem(k);
      snapAssert("strictEqual", void 0);
      curRxStorage.setItem(k, "a new bind");
      return snapAssert("strictEqual", "a new bind");
    });
    return QUnit.test(storage + ".collisions", function(assert) {
      var jsonK, k;
      k = testKey("collisions");
      jsonK = rxStorage.__jsonPrefix(k);
      curRxStorage.setItem(k, "bindstring");
      assert.strictEqual(windowStorage[jsonK], void 0);
      assert.strictEqual(windowStorage[k], "bindstring");
      assert.strictEqual(curRxStorage.getItem(k), "bindstring");
      curRxStorage.setItem(k, TEST_OBJECT);
      assert.strictEqual(windowStorage[k], void 0);
      assert.strictEqual(windowStorage[jsonK], JSON.stringify(TEST_OBJECT));
      assert.deepEqual(curRxStorage.getItem(k), TEST_OBJECT);
      curRxStorage.setItem(k, TEST_ARRAY);
      assert.strictEqual(windowStorage[k], void 0);
      assert.strictEqual(windowStorage[jsonK], JSON.stringify(TEST_ARRAY));
      assert.deepEqual(curRxStorage.getItem(k), TEST_ARRAY);
      curRxStorage.setItem(k, "a new bind");
      assert.strictEqual(windowStorage[jsonK], void 0);
      assert.strictEqual(windowStorage[k], "a new bind");
      return assert.strictEqual(curRxStorage.getItem(k), "a new bind");
    });
  });

}).call(this);

//# sourceMappingURL=tests.js.map
