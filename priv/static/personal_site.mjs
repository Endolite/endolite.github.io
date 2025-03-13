// build/dev/javascript/prelude.mjs
var CustomType = class {
  withFields(fields) {
    let properties = Object.keys(this).map(
      (label2) => label2 in fields ? fields[label2] : this[label2]
    );
    return new this.constructor(...properties);
  }
};
var List = class {
  static fromArray(array3, tail) {
    let t = tail || new Empty();
    for (let i2 = array3.length - 1; i2 >= 0; --i2) {
      t = new NonEmpty(array3[i2], t);
    }
    return t;
  }
  [Symbol.iterator]() {
    return new ListIterator(this);
  }
  toArray() {
    return [...this];
  }
  // @internal
  atLeastLength(desired) {
    let current = this;
    while (desired-- > 0 && current)
      current = current.tail;
    return current !== void 0;
  }
  // @internal
  hasLength(desired) {
    let current = this;
    while (desired-- > 0 && current)
      current = current.tail;
    return desired === -1 && current instanceof Empty;
  }
  // @internal
  countLength() {
    let current = this;
    let length3 = 0;
    while (current) {
      current = current.tail;
      length3++;
    }
    return length3 - 1;
  }
};
function prepend(element2, tail) {
  return new NonEmpty(element2, tail);
}
function toList(elements2, tail) {
  return List.fromArray(elements2, tail);
}
var ListIterator = class {
  #current;
  constructor(current) {
    this.#current = current;
  }
  next() {
    if (this.#current instanceof Empty) {
      return { done: true };
    } else {
      let { head: head2, tail } = this.#current;
      this.#current = tail;
      return { value: head2, done: false };
    }
  }
};
var Empty = class extends List {
};
var NonEmpty = class extends List {
  constructor(head2, tail) {
    super();
    this.head = head2;
    this.tail = tail;
  }
};
var BitArray = class {
  /**
   * The size in bits of this bit array's data.
   *
   * @type {number}
   */
  bitSize;
  /**
   * The size in bytes of this bit array's data. If this bit array doesn't store
   * a whole number of bytes then this value is rounded up.
   *
   * @type {number}
   */
  byteSize;
  /**
   * The number of unused high bits in the first byte of this bit array's
   * buffer prior to the start of its data. The value of any unused high bits is
   * undefined.
   *
   * The bit offset will be in the range 0-7.
   *
   * @type {number}
   */
  bitOffset;
  /**
   * The raw bytes that hold this bit array's data.
   *
   * If `bitOffset` is not zero then there are unused high bits in the first
   * byte of this buffer.
   *
   * If `bitOffset + bitSize` is not a multiple of 8 then there are unused low
   * bits in the last byte of this buffer.
   *
   * @type {Uint8Array}
   */
  rawBuffer;
  /**
   * Constructs a new bit array from a `Uint8Array`, an optional size in
   * bits, and an optional bit offset.
   *
   * If no bit size is specified it is taken as `buffer.length * 8`, i.e. all
   * bytes in the buffer make up the new bit array's data.
   *
   * If no bit offset is specified it defaults to zero, i.e. there are no unused
   * high bits in the first byte of the buffer.
   *
   * @param {Uint8Array} buffer
   * @param {number} [bitSize]
   * @param {number} [bitOffset]
   */
  constructor(buffer, bitSize, bitOffset) {
    if (!(buffer instanceof Uint8Array)) {
      throw globalThis.Error(
        "BitArray can only be constructed from a Uint8Array"
      );
    }
    this.bitSize = bitSize ?? buffer.length * 8;
    this.byteSize = Math.trunc((this.bitSize + 7) / 8);
    this.bitOffset = bitOffset ?? 0;
    if (this.bitSize < 0) {
      throw globalThis.Error(`BitArray bit size is invalid: ${this.bitSize}`);
    }
    if (this.bitOffset < 0 || this.bitOffset > 7) {
      throw globalThis.Error(
        `BitArray bit offset is invalid: ${this.bitOffset}`
      );
    }
    if (buffer.length !== Math.trunc((this.bitOffset + this.bitSize + 7) / 8)) {
      throw globalThis.Error("BitArray buffer length is invalid");
    }
    this.rawBuffer = buffer;
  }
  /**
   * Returns a specific byte in this bit array. If the byte index is out of
   * range then `undefined` is returned.
   *
   * When returning the final byte of a bit array with a bit size that's not a
   * multiple of 8, the content of the unused low bits are undefined.
   *
   * @param {number} index
   * @returns {number | undefined}
   */
  byteAt(index3) {
    if (index3 < 0 || index3 >= this.byteSize) {
      return void 0;
    }
    return bitArrayByteAt(this.rawBuffer, this.bitOffset, index3);
  }
  /** @internal */
  equals(other) {
    if (this.bitSize !== other.bitSize) {
      return false;
    }
    const wholeByteCount = Math.trunc(this.bitSize / 8);
    if (this.bitOffset === 0 && other.bitOffset === 0) {
      for (let i2 = 0; i2 < wholeByteCount; i2++) {
        if (this.rawBuffer[i2] !== other.rawBuffer[i2]) {
          return false;
        }
      }
      const trailingBitsCount = this.bitSize % 8;
      if (trailingBitsCount) {
        const unusedLowBitCount = 8 - trailingBitsCount;
        if (this.rawBuffer[wholeByteCount] >> unusedLowBitCount !== other.rawBuffer[wholeByteCount] >> unusedLowBitCount) {
          return false;
        }
      }
    } else {
      for (let i2 = 0; i2 < wholeByteCount; i2++) {
        const a2 = bitArrayByteAt(this.rawBuffer, this.bitOffset, i2);
        const b2 = bitArrayByteAt(other.rawBuffer, other.bitOffset, i2);
        if (a2 !== b2) {
          return false;
        }
      }
      const trailingBitsCount = this.bitSize % 8;
      if (trailingBitsCount) {
        const a2 = bitArrayByteAt(
          this.rawBuffer,
          this.bitOffset,
          wholeByteCount
        );
        const b2 = bitArrayByteAt(
          other.rawBuffer,
          other.bitOffset,
          wholeByteCount
        );
        const unusedLowBitCount = 8 - trailingBitsCount;
        if (a2 >> unusedLowBitCount !== b2 >> unusedLowBitCount) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * Returns this bit array's internal buffer.
   *
   * @deprecated Use `BitArray.byteAt()` or `BitArray.rawBuffer` instead.
   *
   * @returns {Uint8Array}
   */
  get buffer() {
    bitArrayPrintDeprecationWarning(
      "buffer",
      "Use BitArray.byteAt() or BitArray.rawBuffer instead"
    );
    if (this.bitOffset !== 0 || this.bitSize % 8 !== 0) {
      throw new globalThis.Error(
        "BitArray.buffer does not support unaligned bit arrays"
      );
    }
    return this.rawBuffer;
  }
  /**
   * Returns the length in bytes of this bit array's internal buffer.
   *
   * @deprecated Use `BitArray.bitSize` or `BitArray.byteSize` instead.
   *
   * @returns {number}
   */
  get length() {
    bitArrayPrintDeprecationWarning(
      "length",
      "Use BitArray.bitSize or BitArray.byteSize instead"
    );
    if (this.bitOffset !== 0 || this.bitSize % 8 !== 0) {
      throw new globalThis.Error(
        "BitArray.length does not support unaligned bit arrays"
      );
    }
    return this.rawBuffer.length;
  }
};
function bitArrayByteAt(buffer, bitOffset, index3) {
  if (bitOffset === 0) {
    return buffer[index3] ?? 0;
  } else {
    const a2 = buffer[index3] << bitOffset & 255;
    const b2 = buffer[index3 + 1] >> 8 - bitOffset;
    return a2 | b2;
  }
}
var isBitArrayDeprecationMessagePrinted = {};
function bitArrayPrintDeprecationWarning(name, message) {
  if (isBitArrayDeprecationMessagePrinted[name]) {
    return;
  }
  console.warn(
    `Deprecated BitArray.${name} property used in JavaScript FFI code. ${message}.`
  );
  isBitArrayDeprecationMessagePrinted[name] = true;
}
var Result = class _Result extends CustomType {
  // @internal
  static isResult(data) {
    return data instanceof _Result;
  }
};
var Ok = class extends Result {
  constructor(value) {
    super();
    this[0] = value;
  }
  // @internal
  isOk() {
    return true;
  }
};
var Error = class extends Result {
  constructor(detail) {
    super();
    this[0] = detail;
  }
  // @internal
  isOk() {
    return false;
  }
};
function isEqual(x, y) {
  let values2 = [x, y];
  while (values2.length) {
    let a2 = values2.pop();
    let b2 = values2.pop();
    if (a2 === b2)
      continue;
    if (!isObject(a2) || !isObject(b2))
      return false;
    let unequal = !structurallyCompatibleObjects(a2, b2) || unequalDates(a2, b2) || unequalBuffers(a2, b2) || unequalArrays(a2, b2) || unequalMaps(a2, b2) || unequalSets(a2, b2) || unequalRegExps(a2, b2);
    if (unequal)
      return false;
    const proto = Object.getPrototypeOf(a2);
    if (proto !== null && typeof proto.equals === "function") {
      try {
        if (a2.equals(b2))
          continue;
        else
          return false;
      } catch {
      }
    }
    let [keys2, get] = getters(a2);
    for (let k of keys2(a2)) {
      values2.push(get(a2, k), get(b2, k));
    }
  }
  return true;
}
function getters(object3) {
  if (object3 instanceof Map) {
    return [(x) => x.keys(), (x, y) => x.get(y)];
  } else {
    let extra = object3 instanceof globalThis.Error ? ["message"] : [];
    return [(x) => [...extra, ...Object.keys(x)], (x, y) => x[y]];
  }
}
function unequalDates(a2, b2) {
  return a2 instanceof Date && (a2 > b2 || a2 < b2);
}
function unequalBuffers(a2, b2) {
  return !(a2 instanceof BitArray) && a2.buffer instanceof ArrayBuffer && a2.BYTES_PER_ELEMENT && !(a2.byteLength === b2.byteLength && a2.every((n, i2) => n === b2[i2]));
}
function unequalArrays(a2, b2) {
  return Array.isArray(a2) && a2.length !== b2.length;
}
function unequalMaps(a2, b2) {
  return a2 instanceof Map && a2.size !== b2.size;
}
function unequalSets(a2, b2) {
  return a2 instanceof Set && (a2.size != b2.size || [...a2].some((e) => !b2.has(e)));
}
function unequalRegExps(a2, b2) {
  return a2 instanceof RegExp && (a2.source !== b2.source || a2.flags !== b2.flags);
}
function isObject(a2) {
  return typeof a2 === "object" && a2 !== null;
}
function structurallyCompatibleObjects(a2, b2) {
  if (typeof a2 !== "object" && typeof b2 !== "object" && (!a2 || !b2))
    return false;
  let nonstructural = [Promise, WeakSet, WeakMap, Function];
  if (nonstructural.some((c) => a2 instanceof c))
    return false;
  return a2.constructor === b2.constructor;
}
function makeError(variant2, module, line, fn, message, extra) {
  let error = new globalThis.Error(message);
  error.gleam_error = variant2;
  error.module = module;
  error.line = line;
  error.function = fn;
  error.fn = fn;
  for (let k in extra)
    error[k] = extra[k];
  return error;
}

// build/dev/javascript/gleam_stdlib/gleam/option.mjs
var Some = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var None = class extends CustomType {
};

// build/dev/javascript/gleam_stdlib/gleam/string.mjs
function drop_start(loop$string, loop$num_graphemes) {
  while (true) {
    let string3 = loop$string;
    let num_graphemes = loop$num_graphemes;
    let $ = num_graphemes > 0;
    if (!$) {
      return string3;
    } else {
      let $1 = pop_grapheme(string3);
      if ($1.isOk()) {
        let string$1 = $1[0][1];
        loop$string = string$1;
        loop$num_graphemes = num_graphemes - 1;
      } else {
        return string3;
      }
    }
  }
}
function split2(x, substring) {
  if (substring === "") {
    return graphemes(x);
  } else {
    let _pipe = x;
    let _pipe$1 = identity(_pipe);
    let _pipe$2 = split(_pipe$1, substring);
    return map(_pipe$2, identity);
  }
}

// build/dev/javascript/gleam_stdlib/gleam/result.mjs
function unwrap(result, default$) {
  if (result.isOk()) {
    let v = result[0];
    return v;
  } else {
    return default$;
  }
}

// build/dev/javascript/gleam_stdlib/dict.mjs
var referenceMap = /* @__PURE__ */ new WeakMap();
var tempDataView = new DataView(new ArrayBuffer(8));
var referenceUID = 0;
function hashByReference(o) {
  const known = referenceMap.get(o);
  if (known !== void 0) {
    return known;
  }
  const hash = referenceUID++;
  if (referenceUID === 2147483647) {
    referenceUID = 0;
  }
  referenceMap.set(o, hash);
  return hash;
}
function hashMerge(a2, b2) {
  return a2 ^ b2 + 2654435769 + (a2 << 6) + (a2 >> 2) | 0;
}
function hashString(s) {
  let hash = 0;
  const len = s.length;
  for (let i2 = 0; i2 < len; i2++) {
    hash = Math.imul(31, hash) + s.charCodeAt(i2) | 0;
  }
  return hash;
}
function hashNumber(n) {
  tempDataView.setFloat64(0, n);
  const i2 = tempDataView.getInt32(0);
  const j = tempDataView.getInt32(4);
  return Math.imul(73244475, i2 >> 16 ^ i2) ^ j;
}
function hashBigInt(n) {
  return hashString(n.toString());
}
function hashObject(o) {
  const proto = Object.getPrototypeOf(o);
  if (proto !== null && typeof proto.hashCode === "function") {
    try {
      const code = o.hashCode(o);
      if (typeof code === "number") {
        return code;
      }
    } catch {
    }
  }
  if (o instanceof Promise || o instanceof WeakSet || o instanceof WeakMap) {
    return hashByReference(o);
  }
  if (o instanceof Date) {
    return hashNumber(o.getTime());
  }
  let h = 0;
  if (o instanceof ArrayBuffer) {
    o = new Uint8Array(o);
  }
  if (Array.isArray(o) || o instanceof Uint8Array) {
    for (let i2 = 0; i2 < o.length; i2++) {
      h = Math.imul(31, h) + getHash(o[i2]) | 0;
    }
  } else if (o instanceof Set) {
    o.forEach((v) => {
      h = h + getHash(v) | 0;
    });
  } else if (o instanceof Map) {
    o.forEach((v, k) => {
      h = h + hashMerge(getHash(v), getHash(k)) | 0;
    });
  } else {
    const keys2 = Object.keys(o);
    for (let i2 = 0; i2 < keys2.length; i2++) {
      const k = keys2[i2];
      const v = o[k];
      h = h + hashMerge(getHash(v), hashString(k)) | 0;
    }
  }
  return h;
}
function getHash(u) {
  if (u === null)
    return 1108378658;
  if (u === void 0)
    return 1108378659;
  if (u === true)
    return 1108378657;
  if (u === false)
    return 1108378656;
  switch (typeof u) {
    case "number":
      return hashNumber(u);
    case "string":
      return hashString(u);
    case "bigint":
      return hashBigInt(u);
    case "object":
      return hashObject(u);
    case "symbol":
      return hashByReference(u);
    case "function":
      return hashByReference(u);
    default:
      return 0;
  }
}
var SHIFT = 5;
var BUCKET_SIZE = Math.pow(2, SHIFT);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;
var ENTRY = 0;
var ARRAY_NODE = 1;
var INDEX_NODE = 2;
var COLLISION_NODE = 3;
var EMPTY = {
  type: INDEX_NODE,
  bitmap: 0,
  array: []
};
function mask(hash, shift) {
  return hash >>> shift & MASK;
}
function bitpos(hash, shift) {
  return 1 << mask(hash, shift);
}
function bitcount(x) {
  x -= x >> 1 & 1431655765;
  x = (x & 858993459) + (x >> 2 & 858993459);
  x = x + (x >> 4) & 252645135;
  x += x >> 8;
  x += x >> 16;
  return x & 127;
}
function index(bitmap, bit) {
  return bitcount(bitmap & bit - 1);
}
function cloneAndSet(arr, at, val) {
  const len = arr.length;
  const out = new Array(len);
  for (let i2 = 0; i2 < len; ++i2) {
    out[i2] = arr[i2];
  }
  out[at] = val;
  return out;
}
function spliceIn(arr, at, val) {
  const len = arr.length;
  const out = new Array(len + 1);
  let i2 = 0;
  let g = 0;
  while (i2 < at) {
    out[g++] = arr[i2++];
  }
  out[g++] = val;
  while (i2 < len) {
    out[g++] = arr[i2++];
  }
  return out;
}
function spliceOut(arr, at) {
  const len = arr.length;
  const out = new Array(len - 1);
  let i2 = 0;
  let g = 0;
  while (i2 < at) {
    out[g++] = arr[i2++];
  }
  ++i2;
  while (i2 < len) {
    out[g++] = arr[i2++];
  }
  return out;
}
function createNode(shift, key1, val1, key2hash, key2, val2) {
  const key1hash = getHash(key1);
  if (key1hash === key2hash) {
    return {
      type: COLLISION_NODE,
      hash: key1hash,
      array: [
        { type: ENTRY, k: key1, v: val1 },
        { type: ENTRY, k: key2, v: val2 }
      ]
    };
  }
  const addedLeaf = { val: false };
  return assoc(
    assocIndex(EMPTY, shift, key1hash, key1, val1, addedLeaf),
    shift,
    key2hash,
    key2,
    val2,
    addedLeaf
  );
}
function assoc(root, shift, hash, key, val, addedLeaf) {
  switch (root.type) {
    case ARRAY_NODE:
      return assocArray(root, shift, hash, key, val, addedLeaf);
    case INDEX_NODE:
      return assocIndex(root, shift, hash, key, val, addedLeaf);
    case COLLISION_NODE:
      return assocCollision(root, shift, hash, key, val, addedLeaf);
  }
}
function assocArray(root, shift, hash, key, val, addedLeaf) {
  const idx = mask(hash, shift);
  const node = root.array[idx];
  if (node === void 0) {
    addedLeaf.val = true;
    return {
      type: ARRAY_NODE,
      size: root.size + 1,
      array: cloneAndSet(root.array, idx, { type: ENTRY, k: key, v: val })
    };
  }
  if (node.type === ENTRY) {
    if (isEqual(key, node.k)) {
      if (val === node.v) {
        return root;
      }
      return {
        type: ARRAY_NODE,
        size: root.size,
        array: cloneAndSet(root.array, idx, {
          type: ENTRY,
          k: key,
          v: val
        })
      };
    }
    addedLeaf.val = true;
    return {
      type: ARRAY_NODE,
      size: root.size,
      array: cloneAndSet(
        root.array,
        idx,
        createNode(shift + SHIFT, node.k, node.v, hash, key, val)
      )
    };
  }
  const n = assoc(node, shift + SHIFT, hash, key, val, addedLeaf);
  if (n === node) {
    return root;
  }
  return {
    type: ARRAY_NODE,
    size: root.size,
    array: cloneAndSet(root.array, idx, n)
  };
}
function assocIndex(root, shift, hash, key, val, addedLeaf) {
  const bit = bitpos(hash, shift);
  const idx = index(root.bitmap, bit);
  if ((root.bitmap & bit) !== 0) {
    const node = root.array[idx];
    if (node.type !== ENTRY) {
      const n = assoc(node, shift + SHIFT, hash, key, val, addedLeaf);
      if (n === node) {
        return root;
      }
      return {
        type: INDEX_NODE,
        bitmap: root.bitmap,
        array: cloneAndSet(root.array, idx, n)
      };
    }
    const nodeKey = node.k;
    if (isEqual(key, nodeKey)) {
      if (val === node.v) {
        return root;
      }
      return {
        type: INDEX_NODE,
        bitmap: root.bitmap,
        array: cloneAndSet(root.array, idx, {
          type: ENTRY,
          k: key,
          v: val
        })
      };
    }
    addedLeaf.val = true;
    return {
      type: INDEX_NODE,
      bitmap: root.bitmap,
      array: cloneAndSet(
        root.array,
        idx,
        createNode(shift + SHIFT, nodeKey, node.v, hash, key, val)
      )
    };
  } else {
    const n = root.array.length;
    if (n >= MAX_INDEX_NODE) {
      const nodes = new Array(32);
      const jdx = mask(hash, shift);
      nodes[jdx] = assocIndex(EMPTY, shift + SHIFT, hash, key, val, addedLeaf);
      let j = 0;
      let bitmap = root.bitmap;
      for (let i2 = 0; i2 < 32; i2++) {
        if ((bitmap & 1) !== 0) {
          const node = root.array[j++];
          nodes[i2] = node;
        }
        bitmap = bitmap >>> 1;
      }
      return {
        type: ARRAY_NODE,
        size: n + 1,
        array: nodes
      };
    } else {
      const newArray = spliceIn(root.array, idx, {
        type: ENTRY,
        k: key,
        v: val
      });
      addedLeaf.val = true;
      return {
        type: INDEX_NODE,
        bitmap: root.bitmap | bit,
        array: newArray
      };
    }
  }
}
function assocCollision(root, shift, hash, key, val, addedLeaf) {
  if (hash === root.hash) {
    const idx = collisionIndexOf(root, key);
    if (idx !== -1) {
      const entry = root.array[idx];
      if (entry.v === val) {
        return root;
      }
      return {
        type: COLLISION_NODE,
        hash,
        array: cloneAndSet(root.array, idx, { type: ENTRY, k: key, v: val })
      };
    }
    const size = root.array.length;
    addedLeaf.val = true;
    return {
      type: COLLISION_NODE,
      hash,
      array: cloneAndSet(root.array, size, { type: ENTRY, k: key, v: val })
    };
  }
  return assoc(
    {
      type: INDEX_NODE,
      bitmap: bitpos(root.hash, shift),
      array: [root]
    },
    shift,
    hash,
    key,
    val,
    addedLeaf
  );
}
function collisionIndexOf(root, key) {
  const size = root.array.length;
  for (let i2 = 0; i2 < size; i2++) {
    if (isEqual(key, root.array[i2].k)) {
      return i2;
    }
  }
  return -1;
}
function find(root, shift, hash, key) {
  switch (root.type) {
    case ARRAY_NODE:
      return findArray(root, shift, hash, key);
    case INDEX_NODE:
      return findIndex(root, shift, hash, key);
    case COLLISION_NODE:
      return findCollision(root, key);
  }
}
function findArray(root, shift, hash, key) {
  const idx = mask(hash, shift);
  const node = root.array[idx];
  if (node === void 0) {
    return void 0;
  }
  if (node.type !== ENTRY) {
    return find(node, shift + SHIFT, hash, key);
  }
  if (isEqual(key, node.k)) {
    return node;
  }
  return void 0;
}
function findIndex(root, shift, hash, key) {
  const bit = bitpos(hash, shift);
  if ((root.bitmap & bit) === 0) {
    return void 0;
  }
  const idx = index(root.bitmap, bit);
  const node = root.array[idx];
  if (node.type !== ENTRY) {
    return find(node, shift + SHIFT, hash, key);
  }
  if (isEqual(key, node.k)) {
    return node;
  }
  return void 0;
}
function findCollision(root, key) {
  const idx = collisionIndexOf(root, key);
  if (idx < 0) {
    return void 0;
  }
  return root.array[idx];
}
function without(root, shift, hash, key) {
  switch (root.type) {
    case ARRAY_NODE:
      return withoutArray(root, shift, hash, key);
    case INDEX_NODE:
      return withoutIndex(root, shift, hash, key);
    case COLLISION_NODE:
      return withoutCollision(root, key);
  }
}
function withoutArray(root, shift, hash, key) {
  const idx = mask(hash, shift);
  const node = root.array[idx];
  if (node === void 0) {
    return root;
  }
  let n = void 0;
  if (node.type === ENTRY) {
    if (!isEqual(node.k, key)) {
      return root;
    }
  } else {
    n = without(node, shift + SHIFT, hash, key);
    if (n === node) {
      return root;
    }
  }
  if (n === void 0) {
    if (root.size <= MIN_ARRAY_NODE) {
      const arr = root.array;
      const out = new Array(root.size - 1);
      let i2 = 0;
      let j = 0;
      let bitmap = 0;
      while (i2 < idx) {
        const nv = arr[i2];
        if (nv !== void 0) {
          out[j] = nv;
          bitmap |= 1 << i2;
          ++j;
        }
        ++i2;
      }
      ++i2;
      while (i2 < arr.length) {
        const nv = arr[i2];
        if (nv !== void 0) {
          out[j] = nv;
          bitmap |= 1 << i2;
          ++j;
        }
        ++i2;
      }
      return {
        type: INDEX_NODE,
        bitmap,
        array: out
      };
    }
    return {
      type: ARRAY_NODE,
      size: root.size - 1,
      array: cloneAndSet(root.array, idx, n)
    };
  }
  return {
    type: ARRAY_NODE,
    size: root.size,
    array: cloneAndSet(root.array, idx, n)
  };
}
function withoutIndex(root, shift, hash, key) {
  const bit = bitpos(hash, shift);
  if ((root.bitmap & bit) === 0) {
    return root;
  }
  const idx = index(root.bitmap, bit);
  const node = root.array[idx];
  if (node.type !== ENTRY) {
    const n = without(node, shift + SHIFT, hash, key);
    if (n === node) {
      return root;
    }
    if (n !== void 0) {
      return {
        type: INDEX_NODE,
        bitmap: root.bitmap,
        array: cloneAndSet(root.array, idx, n)
      };
    }
    if (root.bitmap === bit) {
      return void 0;
    }
    return {
      type: INDEX_NODE,
      bitmap: root.bitmap ^ bit,
      array: spliceOut(root.array, idx)
    };
  }
  if (isEqual(key, node.k)) {
    if (root.bitmap === bit) {
      return void 0;
    }
    return {
      type: INDEX_NODE,
      bitmap: root.bitmap ^ bit,
      array: spliceOut(root.array, idx)
    };
  }
  return root;
}
function withoutCollision(root, key) {
  const idx = collisionIndexOf(root, key);
  if (idx < 0) {
    return root;
  }
  if (root.array.length === 1) {
    return void 0;
  }
  return {
    type: COLLISION_NODE,
    hash: root.hash,
    array: spliceOut(root.array, idx)
  };
}
function forEach(root, fn) {
  if (root === void 0) {
    return;
  }
  const items = root.array;
  const size = items.length;
  for (let i2 = 0; i2 < size; i2++) {
    const item = items[i2];
    if (item === void 0) {
      continue;
    }
    if (item.type === ENTRY) {
      fn(item.v, item.k);
      continue;
    }
    forEach(item, fn);
  }
}
var Dict = class _Dict {
  /**
   * @template V
   * @param {Record<string,V>} o
   * @returns {Dict<string,V>}
   */
  static fromObject(o) {
    const keys2 = Object.keys(o);
    let m = _Dict.new();
    for (let i2 = 0; i2 < keys2.length; i2++) {
      const k = keys2[i2];
      m = m.set(k, o[k]);
    }
    return m;
  }
  /**
   * @template K,V
   * @param {Map<K,V>} o
   * @returns {Dict<K,V>}
   */
  static fromMap(o) {
    let m = _Dict.new();
    o.forEach((v, k) => {
      m = m.set(k, v);
    });
    return m;
  }
  static new() {
    return new _Dict(void 0, 0);
  }
  /**
   * @param {undefined | Node<K,V>} root
   * @param {number} size
   */
  constructor(root, size) {
    this.root = root;
    this.size = size;
  }
  /**
   * @template NotFound
   * @param {K} key
   * @param {NotFound} notFound
   * @returns {NotFound | V}
   */
  get(key, notFound) {
    if (this.root === void 0) {
      return notFound;
    }
    const found = find(this.root, 0, getHash(key), key);
    if (found === void 0) {
      return notFound;
    }
    return found.v;
  }
  /**
   * @param {K} key
   * @param {V} val
   * @returns {Dict<K,V>}
   */
  set(key, val) {
    const addedLeaf = { val: false };
    const root = this.root === void 0 ? EMPTY : this.root;
    const newRoot = assoc(root, 0, getHash(key), key, val, addedLeaf);
    if (newRoot === this.root) {
      return this;
    }
    return new _Dict(newRoot, addedLeaf.val ? this.size + 1 : this.size);
  }
  /**
   * @param {K} key
   * @returns {Dict<K,V>}
   */
  delete(key) {
    if (this.root === void 0) {
      return this;
    }
    const newRoot = without(this.root, 0, getHash(key), key);
    if (newRoot === this.root) {
      return this;
    }
    if (newRoot === void 0) {
      return _Dict.new();
    }
    return new _Dict(newRoot, this.size - 1);
  }
  /**
   * @param {K} key
   * @returns {boolean}
   */
  has(key) {
    if (this.root === void 0) {
      return false;
    }
    return find(this.root, 0, getHash(key), key) !== void 0;
  }
  /**
   * @returns {[K,V][]}
   */
  entries() {
    if (this.root === void 0) {
      return [];
    }
    const result = [];
    this.forEach((v, k) => result.push([k, v]));
    return result;
  }
  /**
   *
   * @param {(val:V,key:K)=>void} fn
   */
  forEach(fn) {
    forEach(this.root, fn);
  }
  hashCode() {
    let h = 0;
    this.forEach((v, k) => {
      h = h + hashMerge(getHash(v), getHash(k)) | 0;
    });
    return h;
  }
  /**
   * @param {unknown} o
   * @returns {boolean}
   */
  equals(o) {
    if (!(o instanceof _Dict) || this.size !== o.size) {
      return false;
    }
    try {
      this.forEach((v, k) => {
        if (!isEqual(o.get(k, !v), v)) {
          throw unequalDictSymbol;
        }
      });
      return true;
    } catch (e) {
      if (e === unequalDictSymbol) {
        return false;
      }
      throw e;
    }
  }
};
var unequalDictSymbol = Symbol();

// build/dev/javascript/gleam_stdlib/gleam_stdlib.mjs
var Nil = void 0;
function identity(x) {
  return x;
}
function to_string(term) {
  return term.toString();
}
function graphemes(string3) {
  const iterator = graphemes_iterator(string3);
  if (iterator) {
    return List.fromArray(Array.from(iterator).map((item) => item.segment));
  } else {
    return List.fromArray(string3.match(/./gsu));
  }
}
var segmenter = void 0;
function graphemes_iterator(string3) {
  if (globalThis.Intl && Intl.Segmenter) {
    segmenter ||= new Intl.Segmenter();
    return segmenter.segment(string3)[Symbol.iterator]();
  }
}
function pop_grapheme(string3) {
  let first2;
  const iterator = graphemes_iterator(string3);
  if (iterator) {
    first2 = iterator.next().value?.segment;
  } else {
    first2 = string3.match(/./su)?.[0];
  }
  if (first2) {
    return new Ok([first2, string3.slice(first2.length)]);
  } else {
    return new Error(Nil);
  }
}
function split(xs, pattern) {
  return List.fromArray(xs.split(pattern));
}
var unicode_whitespaces = [
  " ",
  // Space
  "	",
  // Horizontal tab
  "\n",
  // Line feed
  "\v",
  // Vertical tab
  "\f",
  // Form feed
  "\r",
  // Carriage return
  "\x85",
  // Next line
  "\u2028",
  // Line separator
  "\u2029"
  // Paragraph separator
].join("");
var trim_start_regex = new RegExp(`^[${unicode_whitespaces}]*`);
var trim_end_regex = new RegExp(`[${unicode_whitespaces}]*$`);
function new_map() {
  return Dict.new();
}
function map_to_list(map4) {
  return List.fromArray(map4.entries());
}
function map_insert(key, value, map4) {
  return map4.set(key, value);
}

// build/dev/javascript/gleam_stdlib/gleam/dict.mjs
function insert(dict2, key, value) {
  return map_insert(key, value, dict2);
}
function reverse_and_concat(loop$remaining, loop$accumulator) {
  while (true) {
    let remaining = loop$remaining;
    let accumulator = loop$accumulator;
    if (remaining.hasLength(0)) {
      return accumulator;
    } else {
      let first2 = remaining.head;
      let rest = remaining.tail;
      loop$remaining = rest;
      loop$accumulator = prepend(first2, accumulator);
    }
  }
}
function do_keys_loop(loop$list, loop$acc) {
  while (true) {
    let list2 = loop$list;
    let acc = loop$acc;
    if (list2.hasLength(0)) {
      return reverse_and_concat(acc, toList([]));
    } else {
      let key = list2.head[0];
      let rest = list2.tail;
      loop$list = rest;
      loop$acc = prepend(key, acc);
    }
  }
}
function keys(dict2) {
  return do_keys_loop(map_to_list(dict2), toList([]));
}

// build/dev/javascript/gleam_stdlib/gleam/list.mjs
function reverse_and_prepend(loop$prefix, loop$suffix) {
  while (true) {
    let prefix = loop$prefix;
    let suffix = loop$suffix;
    if (prefix.hasLength(0)) {
      return suffix;
    } else {
      let first$1 = prefix.head;
      let rest$1 = prefix.tail;
      loop$prefix = rest$1;
      loop$suffix = prepend(first$1, suffix);
    }
  }
}
function reverse(list2) {
  return reverse_and_prepend(list2, toList([]));
}
function filter_loop(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list2 = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list2.hasLength(0)) {
      return reverse(acc);
    } else {
      let first$1 = list2.head;
      let rest$1 = list2.tail;
      let new_acc = (() => {
        let $ = fun(first$1);
        if ($) {
          return prepend(first$1, acc);
        } else {
          return acc;
        }
      })();
      loop$list = rest$1;
      loop$fun = fun;
      loop$acc = new_acc;
    }
  }
}
function filter(list2, predicate) {
  return filter_loop(list2, predicate, toList([]));
}
function map_loop(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list2 = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list2.hasLength(0)) {
      return reverse(acc);
    } else {
      let first$1 = list2.head;
      let rest$1 = list2.tail;
      loop$list = rest$1;
      loop$fun = fun;
      loop$acc = prepend(fun(first$1), acc);
    }
  }
}
function map(list2, fun) {
  return map_loop(list2, fun, toList([]));
}
function fold(loop$list, loop$initial, loop$fun) {
  while (true) {
    let list2 = loop$list;
    let initial = loop$initial;
    let fun = loop$fun;
    if (list2.hasLength(0)) {
      return initial;
    } else {
      let first$1 = list2.head;
      let rest$1 = list2.tail;
      loop$list = rest$1;
      loop$initial = fun(initial, first$1);
      loop$fun = fun;
    }
  }
}
function index_fold_loop(loop$over, loop$acc, loop$with, loop$index) {
  while (true) {
    let over = loop$over;
    let acc = loop$acc;
    let with$ = loop$with;
    let index3 = loop$index;
    if (over.hasLength(0)) {
      return acc;
    } else {
      let first$1 = over.head;
      let rest$1 = over.tail;
      loop$over = rest$1;
      loop$acc = with$(acc, first$1, index3);
      loop$with = with$;
      loop$index = index3 + 1;
    }
  }
}
function index_fold(list2, initial, fun) {
  return index_fold_loop(list2, initial, fun, 0);
}

// build/dev/javascript/gleam_stdlib/gleam/uri.mjs
var Uri = class extends CustomType {
  constructor(scheme, userinfo, host, port, path, query, fragment) {
    super();
    this.scheme = scheme;
    this.userinfo = userinfo;
    this.host = host;
    this.port = port;
    this.path = path;
    this.query = query;
    this.fragment = fragment;
  }
};
function remove_dot_segments_loop(loop$input, loop$accumulator) {
  while (true) {
    let input3 = loop$input;
    let accumulator = loop$accumulator;
    if (input3.hasLength(0)) {
      return reverse(accumulator);
    } else {
      let segment = input3.head;
      let rest = input3.tail;
      let accumulator$1 = (() => {
        if (segment === "") {
          let accumulator$12 = accumulator;
          return accumulator$12;
        } else if (segment === ".") {
          let accumulator$12 = accumulator;
          return accumulator$12;
        } else if (segment === ".." && accumulator.hasLength(0)) {
          return toList([]);
        } else if (segment === ".." && accumulator.atLeastLength(1)) {
          let accumulator$12 = accumulator.tail;
          return accumulator$12;
        } else {
          let segment$1 = segment;
          let accumulator$12 = accumulator;
          return prepend(segment$1, accumulator$12);
        }
      })();
      loop$input = rest;
      loop$accumulator = accumulator$1;
    }
  }
}
function remove_dot_segments(input3) {
  return remove_dot_segments_loop(input3, toList([]));
}
function path_segments(path) {
  return remove_dot_segments(split2(path, "/"));
}
var empty = /* @__PURE__ */ new Uri(
  /* @__PURE__ */ new None(),
  /* @__PURE__ */ new None(),
  /* @__PURE__ */ new None(),
  /* @__PURE__ */ new None(),
  "",
  /* @__PURE__ */ new None(),
  /* @__PURE__ */ new None()
);

// build/dev/javascript/gleam_stdlib/gleam/bool.mjs
function guard(requirement, consequence, alternative) {
  if (requirement) {
    return consequence;
  } else {
    return alternative();
  }
}

// build/dev/javascript/lustre/lustre/effect.mjs
var Effect = class extends CustomType {
  constructor(all) {
    super();
    this.all = all;
  }
};
function custom(run2) {
  return new Effect(
    toList([
      (actions) => {
        return run2(actions.dispatch, actions.emit, actions.select, actions.root);
      }
    ])
  );
}
function from(effect) {
  return custom((dispatch, _, _1, _2) => {
    return effect(dispatch);
  });
}
function none() {
  return new Effect(toList([]));
}

// build/dev/javascript/lustre/lustre/internals/vdom.mjs
var Text = class extends CustomType {
  constructor(content) {
    super();
    this.content = content;
  }
};
var Element = class extends CustomType {
  constructor(key, namespace, tag2, attrs, children2, self_closing, void$) {
    super();
    this.key = key;
    this.namespace = namespace;
    this.tag = tag2;
    this.attrs = attrs;
    this.children = children2;
    this.self_closing = self_closing;
    this.void = void$;
  }
};
var Map2 = class extends CustomType {
  constructor(subtree) {
    super();
    this.subtree = subtree;
  }
};
var Attribute = class extends CustomType {
  constructor(x0, x1, as_property) {
    super();
    this[0] = x0;
    this[1] = x1;
    this.as_property = as_property;
  }
};
function attribute_to_event_handler(attribute2) {
  if (attribute2 instanceof Attribute) {
    return new Error(void 0);
  } else {
    let name = attribute2[0];
    let handler = attribute2[1];
    let name$1 = drop_start(name, 2);
    return new Ok([name$1, handler]);
  }
}
function do_element_list_handlers(elements2, handlers2, key) {
  return index_fold(
    elements2,
    handlers2,
    (handlers3, element2, index3) => {
      let key$1 = key + "-" + to_string(index3);
      return do_handlers(element2, handlers3, key$1);
    }
  );
}
function do_handlers(loop$element, loop$handlers, loop$key) {
  while (true) {
    let element2 = loop$element;
    let handlers2 = loop$handlers;
    let key = loop$key;
    if (element2 instanceof Text) {
      return handlers2;
    } else if (element2 instanceof Map2) {
      let subtree = element2.subtree;
      loop$element = subtree();
      loop$handlers = handlers2;
      loop$key = key;
    } else {
      let attrs = element2.attrs;
      let children2 = element2.children;
      let handlers$1 = fold(
        attrs,
        handlers2,
        (handlers3, attr) => {
          let $ = attribute_to_event_handler(attr);
          if ($.isOk()) {
            let name = $[0][0];
            let handler = $[0][1];
            return insert(handlers3, key + "-" + name, handler);
          } else {
            return handlers3;
          }
        }
      );
      return do_element_list_handlers(children2, handlers$1, key);
    }
  }
}
function handlers(element2) {
  return do_handlers(element2, new_map(), "0");
}

// build/dev/javascript/lustre/lustre/attribute.mjs
function attribute(name, value) {
  return new Attribute(name, identity(value), false);
}
function style(properties) {
  return attribute(
    "style",
    fold(
      properties,
      "",
      (styles2, _use1) => {
        let name$1 = _use1[0];
        let value$1 = _use1[1];
        return styles2 + name$1 + ":" + value$1 + ";";
      }
    )
  );
}
function class$(name) {
  return attribute("class", name);
}
function id(name) {
  return attribute("id", name);
}
function href(uri) {
  return attribute("href", uri);
}
function rel(relationship) {
  return attribute("rel", relationship);
}
function src(uri) {
  return attribute("src", uri);
}

// build/dev/javascript/lustre/lustre/element.mjs
function element(tag2, attrs, children2) {
  if (tag2 === "area") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "base") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "br") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "col") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "embed") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "hr") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "img") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "input") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "link") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "meta") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "param") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "source") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "track") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else if (tag2 === "wbr") {
    return new Element("", "", tag2, attrs, toList([]), false, true);
  } else {
    return new Element("", "", tag2, attrs, children2, false, false);
  }
}
function text(content) {
  return new Text(content);
}

// build/dev/javascript/gleam_stdlib/gleam/set.mjs
var Set2 = class extends CustomType {
  constructor(dict2) {
    super();
    this.dict = dict2;
  }
};
function new$2() {
  return new Set2(new_map());
}

// build/dev/javascript/lustre/lustre/internals/patch.mjs
var Diff = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var Emit = class extends CustomType {
  constructor(x0, x1) {
    super();
    this[0] = x0;
    this[1] = x1;
  }
};
var Init = class extends CustomType {
  constructor(x0, x1) {
    super();
    this[0] = x0;
    this[1] = x1;
  }
};
function is_empty_element_diff(diff2) {
  return isEqual(diff2.created, new_map()) && isEqual(
    diff2.removed,
    new$2()
  ) && isEqual(diff2.updated, new_map());
}

// build/dev/javascript/lustre/lustre/internals/runtime.mjs
var Attrs = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var Batch = class extends CustomType {
  constructor(x0, x1) {
    super();
    this[0] = x0;
    this[1] = x1;
  }
};
var Debug = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var Dispatch = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var Emit2 = class extends CustomType {
  constructor(x0, x1) {
    super();
    this[0] = x0;
    this[1] = x1;
  }
};
var Event2 = class extends CustomType {
  constructor(x0, x1) {
    super();
    this[0] = x0;
    this[1] = x1;
  }
};
var Shutdown = class extends CustomType {
};
var Subscribe = class extends CustomType {
  constructor(x0, x1) {
    super();
    this[0] = x0;
    this[1] = x1;
  }
};
var Unsubscribe = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var ForceModel = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};

// build/dev/javascript/lustre/vdom.ffi.mjs
if (globalThis.customElements && !globalThis.customElements.get("lustre-fragment")) {
  globalThis.customElements.define(
    "lustre-fragment",
    class LustreFragment extends HTMLElement {
      constructor() {
        super();
      }
    }
  );
}
function morph(prev, next, dispatch) {
  let out;
  let stack3 = [{ prev, next, parent: prev.parentNode }];
  while (stack3.length) {
    let { prev: prev2, next: next2, parent } = stack3.pop();
    while (next2.subtree !== void 0)
      next2 = next2.subtree();
    if (next2.content !== void 0) {
      if (!prev2) {
        const created = document.createTextNode(next2.content);
        parent.appendChild(created);
        out ??= created;
      } else if (prev2.nodeType === Node.TEXT_NODE) {
        if (prev2.textContent !== next2.content)
          prev2.textContent = next2.content;
        out ??= prev2;
      } else {
        const created = document.createTextNode(next2.content);
        parent.replaceChild(created, prev2);
        out ??= created;
      }
    } else if (next2.tag !== void 0) {
      const created = createElementNode({
        prev: prev2,
        next: next2,
        dispatch,
        stack: stack3
      });
      if (!prev2) {
        parent.appendChild(created);
      } else if (prev2 !== created) {
        parent.replaceChild(created, prev2);
      }
      out ??= created;
    }
  }
  return out;
}
function createElementNode({ prev, next, dispatch, stack: stack3 }) {
  const namespace = next.namespace || "http://www.w3.org/1999/xhtml";
  const canMorph = prev && prev.nodeType === Node.ELEMENT_NODE && prev.localName === next.tag && prev.namespaceURI === (next.namespace || "http://www.w3.org/1999/xhtml");
  const el = canMorph ? prev : namespace ? document.createElementNS(namespace, next.tag) : document.createElement(next.tag);
  let handlersForEl;
  if (!registeredHandlers.has(el)) {
    const emptyHandlers = /* @__PURE__ */ new Map();
    registeredHandlers.set(el, emptyHandlers);
    handlersForEl = emptyHandlers;
  } else {
    handlersForEl = registeredHandlers.get(el);
  }
  const prevHandlers = canMorph ? new Set(handlersForEl.keys()) : null;
  const prevAttributes = canMorph ? new Set(Array.from(prev.attributes, (a2) => a2.name)) : null;
  let className = null;
  let style3 = null;
  let innerHTML = null;
  if (canMorph && next.tag === "textarea") {
    const innertText = next.children[Symbol.iterator]().next().value?.content;
    if (innertText !== void 0)
      el.value = innertText;
  }
  const delegated = [];
  for (const attr of next.attrs) {
    const name = attr[0];
    const value = attr[1];
    if (attr.as_property) {
      if (el[name] !== value)
        el[name] = value;
      if (canMorph)
        prevAttributes.delete(name);
    } else if (name.startsWith("on")) {
      const eventName = name.slice(2);
      const callback = dispatch(value, eventName === "input");
      if (!handlersForEl.has(eventName)) {
        el.addEventListener(eventName, lustreGenericEventHandler);
      }
      handlersForEl.set(eventName, callback);
      if (canMorph)
        prevHandlers.delete(eventName);
    } else if (name.startsWith("data-lustre-on-")) {
      const eventName = name.slice(15);
      const callback = dispatch(lustreServerEventHandler);
      if (!handlersForEl.has(eventName)) {
        el.addEventListener(eventName, lustreGenericEventHandler);
      }
      handlersForEl.set(eventName, callback);
      el.setAttribute(name, value);
      if (canMorph) {
        prevHandlers.delete(eventName);
        prevAttributes.delete(name);
      }
    } else if (name.startsWith("delegate:data-") || name.startsWith("delegate:aria-")) {
      el.setAttribute(name, value);
      delegated.push([name.slice(10), value]);
    } else if (name === "class") {
      className = className === null ? value : className + " " + value;
    } else if (name === "style") {
      style3 = style3 === null ? value : style3 + value;
    } else if (name === "dangerous-unescaped-html") {
      innerHTML = value;
    } else {
      if (el.getAttribute(name) !== value)
        el.setAttribute(name, value);
      if (name === "value" || name === "selected")
        el[name] = value;
      if (canMorph)
        prevAttributes.delete(name);
    }
  }
  if (className !== null) {
    el.setAttribute("class", className);
    if (canMorph)
      prevAttributes.delete("class");
  }
  if (style3 !== null) {
    el.setAttribute("style", style3);
    if (canMorph)
      prevAttributes.delete("style");
  }
  if (canMorph) {
    for (const attr of prevAttributes) {
      el.removeAttribute(attr);
    }
    for (const eventName of prevHandlers) {
      handlersForEl.delete(eventName);
      el.removeEventListener(eventName, lustreGenericEventHandler);
    }
  }
  if (next.tag === "slot") {
    window.queueMicrotask(() => {
      for (const child of el.assignedElements()) {
        for (const [name, value] of delegated) {
          if (!child.hasAttribute(name)) {
            child.setAttribute(name, value);
          }
        }
      }
    });
  }
  if (next.key !== void 0 && next.key !== "") {
    el.setAttribute("data-lustre-key", next.key);
  } else if (innerHTML !== null) {
    el.innerHTML = innerHTML;
    return el;
  }
  let prevChild = el.firstChild;
  let seenKeys = null;
  let keyedChildren = null;
  let incomingKeyedChildren = null;
  let firstChild = children(next).next().value;
  if (canMorph && firstChild !== void 0 && // Explicit checks are more verbose but truthy checks force a bunch of comparisons
  // we don't care about: it's never gonna be a number etc.
  firstChild.key !== void 0 && firstChild.key !== "") {
    seenKeys = /* @__PURE__ */ new Set();
    keyedChildren = getKeyedChildren(prev);
    incomingKeyedChildren = getKeyedChildren(next);
    for (const child of children(next)) {
      prevChild = diffKeyedChild(
        prevChild,
        child,
        el,
        stack3,
        incomingKeyedChildren,
        keyedChildren,
        seenKeys
      );
    }
  } else {
    for (const child of children(next)) {
      stack3.unshift({ prev: prevChild, next: child, parent: el });
      prevChild = prevChild?.nextSibling;
    }
  }
  while (prevChild) {
    const next2 = prevChild.nextSibling;
    el.removeChild(prevChild);
    prevChild = next2;
  }
  return el;
}
var registeredHandlers = /* @__PURE__ */ new WeakMap();
function lustreGenericEventHandler(event) {
  const target = event.currentTarget;
  if (!registeredHandlers.has(target)) {
    target.removeEventListener(event.type, lustreGenericEventHandler);
    return;
  }
  const handlersForEventTarget = registeredHandlers.get(target);
  if (!handlersForEventTarget.has(event.type)) {
    target.removeEventListener(event.type, lustreGenericEventHandler);
    return;
  }
  handlersForEventTarget.get(event.type)(event);
}
function lustreServerEventHandler(event) {
  const el = event.currentTarget;
  const tag2 = el.getAttribute(`data-lustre-on-${event.type}`);
  const data = JSON.parse(el.getAttribute("data-lustre-data") || "{}");
  const include = JSON.parse(el.getAttribute("data-lustre-include") || "[]");
  switch (event.type) {
    case "input":
    case "change":
      include.push("target.value");
      break;
  }
  return {
    tag: tag2,
    data: include.reduce(
      (data2, property) => {
        const path = property.split(".");
        for (let i2 = 0, o = data2, e = event; i2 < path.length; i2++) {
          if (i2 === path.length - 1) {
            o[path[i2]] = e[path[i2]];
          } else {
            o[path[i2]] ??= {};
            e = e[path[i2]];
            o = o[path[i2]];
          }
        }
        return data2;
      },
      { data }
    )
  };
}
function getKeyedChildren(el) {
  const keyedChildren = /* @__PURE__ */ new Map();
  if (el) {
    for (const child of children(el)) {
      const key = child?.key || child?.getAttribute?.("data-lustre-key");
      if (key)
        keyedChildren.set(key, child);
    }
  }
  return keyedChildren;
}
function diffKeyedChild(prevChild, child, el, stack3, incomingKeyedChildren, keyedChildren, seenKeys) {
  while (prevChild && !incomingKeyedChildren.has(prevChild.getAttribute("data-lustre-key"))) {
    const nextChild = prevChild.nextSibling;
    el.removeChild(prevChild);
    prevChild = nextChild;
  }
  if (keyedChildren.size === 0) {
    stack3.unshift({ prev: prevChild, next: child, parent: el });
    prevChild = prevChild?.nextSibling;
    return prevChild;
  }
  if (seenKeys.has(child.key)) {
    console.warn(`Duplicate key found in Lustre vnode: ${child.key}`);
    stack3.unshift({ prev: null, next: child, parent: el });
    return prevChild;
  }
  seenKeys.add(child.key);
  const keyedChild = keyedChildren.get(child.key);
  if (!keyedChild && !prevChild) {
    stack3.unshift({ prev: null, next: child, parent: el });
    return prevChild;
  }
  if (!keyedChild && prevChild !== null) {
    const placeholder = document.createTextNode("");
    el.insertBefore(placeholder, prevChild);
    stack3.unshift({ prev: placeholder, next: child, parent: el });
    return prevChild;
  }
  if (!keyedChild || keyedChild === prevChild) {
    stack3.unshift({ prev: prevChild, next: child, parent: el });
    prevChild = prevChild?.nextSibling;
    return prevChild;
  }
  el.insertBefore(keyedChild, prevChild);
  stack3.unshift({ prev: keyedChild, next: child, parent: el });
  return prevChild;
}
function* children(element2) {
  for (const child of element2.children) {
    yield* forceChild(child);
  }
}
function* forceChild(element2) {
  if (element2.subtree !== void 0) {
    yield* forceChild(element2.subtree());
  } else {
    yield element2;
  }
}

// build/dev/javascript/lustre/lustre.ffi.mjs
var LustreClientApplication = class _LustreClientApplication {
  /**
   * @template Flags
   *
   * @param {object} app
   * @param {(flags: Flags) => [Model, Lustre.Effect<Msg>]} app.init
   * @param {(msg: Msg, model: Model) => [Model, Lustre.Effect<Msg>]} app.update
   * @param {(model: Model) => Lustre.Element<Msg>} app.view
   * @param {string | HTMLElement} selector
   * @param {Flags} flags
   *
   * @returns {Gleam.Ok<(action: Lustre.Action<Lustre.Client, Msg>>) => void>}
   */
  static start({ init: init4, update: update2, view: view5 }, selector, flags) {
    if (!is_browser())
      return new Error(new NotABrowser());
    const root = selector instanceof HTMLElement ? selector : document.querySelector(selector);
    if (!root)
      return new Error(new ElementNotFound(selector));
    const app = new _LustreClientApplication(root, init4(flags), update2, view5);
    return new Ok((action) => app.send(action));
  }
  /**
   * @param {Element} root
   * @param {[Model, Lustre.Effect<Msg>]} init
   * @param {(model: Model, msg: Msg) => [Model, Lustre.Effect<Msg>]} update
   * @param {(model: Model) => Lustre.Element<Msg>} view
   *
   * @returns {LustreClientApplication}
   */
  constructor(root, [init4, effects], update2, view5) {
    this.root = root;
    this.#model = init4;
    this.#update = update2;
    this.#view = view5;
    this.#tickScheduled = window.setTimeout(
      () => this.#tick(effects.all.toArray(), true),
      0
    );
  }
  /** @type {Element} */
  root;
  /**
   * @param {Lustre.Action<Lustre.Client, Msg>} action
   *
   * @returns {void}
   */
  send(action) {
    if (action instanceof Debug) {
      if (action[0] instanceof ForceModel) {
        this.#tickScheduled = window.clearTimeout(this.#tickScheduled);
        this.#queue = [];
        this.#model = action[0][0];
        const vdom = this.#view(this.#model);
        const dispatch = (handler, immediate = false) => (event) => {
          const result = handler(event);
          if (result instanceof Ok) {
            this.send(new Dispatch(result[0], immediate));
          }
        };
        const prev = this.root.firstChild ?? this.root.appendChild(document.createTextNode(""));
        morph(prev, vdom, dispatch);
      }
    } else if (action instanceof Dispatch) {
      const msg = action[0];
      const immediate = action[1] ?? false;
      this.#queue.push(msg);
      if (immediate) {
        this.#tickScheduled = window.clearTimeout(this.#tickScheduled);
        this.#tick();
      } else if (!this.#tickScheduled) {
        this.#tickScheduled = window.setTimeout(() => this.#tick());
      }
    } else if (action instanceof Emit2) {
      const event = action[0];
      const data = action[1];
      this.root.dispatchEvent(
        new CustomEvent(event, {
          detail: data,
          bubbles: true,
          composed: true
        })
      );
    } else if (action instanceof Shutdown) {
      this.#tickScheduled = window.clearTimeout(this.#tickScheduled);
      this.#model = null;
      this.#update = null;
      this.#view = null;
      this.#queue = null;
      while (this.root.firstChild) {
        this.root.firstChild.remove();
      }
    }
  }
  /** @type {Model} */
  #model;
  /** @type {(model: Model, msg: Msg) => [Model, Lustre.Effect<Msg>]} */
  #update;
  /** @type {(model: Model) => Lustre.Element<Msg>} */
  #view;
  /** @type {Array<Msg>} */
  #queue = [];
  /** @type {number | undefined} */
  #tickScheduled;
  /**
   * @param {Lustre.Effect<Msg>[]} effects
   */
  #tick(effects = []) {
    this.#tickScheduled = void 0;
    this.#flush(effects);
    const vdom = this.#view(this.#model);
    const dispatch = (handler, immediate = false) => (event) => {
      const result = handler(event);
      if (result instanceof Ok) {
        this.send(new Dispatch(result[0], immediate));
      }
    };
    const prev = this.root.firstChild ?? this.root.appendChild(document.createTextNode(""));
    morph(prev, vdom, dispatch);
  }
  #flush(effects = []) {
    while (this.#queue.length > 0) {
      const msg = this.#queue.shift();
      const [next, effect] = this.#update(this.#model, msg);
      effects = effects.concat(effect.all.toArray());
      this.#model = next;
    }
    while (effects.length > 0) {
      const effect = effects.shift();
      const dispatch = (msg) => this.send(new Dispatch(msg));
      const emit2 = (event, data) => this.root.dispatchEvent(
        new CustomEvent(event, {
          detail: data,
          bubbles: true,
          composed: true
        })
      );
      const select = () => {
      };
      const root = this.root;
      effect({ dispatch, emit: emit2, select, root });
    }
    if (this.#queue.length > 0) {
      this.#flush(effects);
    }
  }
};
var start = LustreClientApplication.start;
var LustreServerApplication = class _LustreServerApplication {
  static start({ init: init4, update: update2, view: view5, on_attribute_change }, flags) {
    const app = new _LustreServerApplication(
      init4(flags),
      update2,
      view5,
      on_attribute_change
    );
    return new Ok((action) => app.send(action));
  }
  constructor([model, effects], update2, view5, on_attribute_change) {
    this.#model = model;
    this.#update = update2;
    this.#view = view5;
    this.#html = view5(model);
    this.#onAttributeChange = on_attribute_change;
    this.#renderers = /* @__PURE__ */ new Map();
    this.#handlers = handlers(this.#html);
    this.#tick(effects.all.toArray());
  }
  send(action) {
    if (action instanceof Attrs) {
      for (const attr of action[0]) {
        const decoder = this.#onAttributeChange.get(attr[0]);
        if (!decoder)
          continue;
        const msg = decoder(attr[1]);
        if (msg instanceof Error)
          continue;
        this.#queue.push(msg);
      }
      this.#tick();
    } else if (action instanceof Batch) {
      this.#queue = this.#queue.concat(action[0].toArray());
      this.#tick(action[1].all.toArray());
    } else if (action instanceof Debug) {
    } else if (action instanceof Dispatch) {
      this.#queue.push(action[0]);
      this.#tick();
    } else if (action instanceof Emit2) {
      const event = new Emit(action[0], action[1]);
      for (const [_, renderer] of this.#renderers) {
        renderer(event);
      }
    } else if (action instanceof Event2) {
      const handler = this.#handlers.get(action[0]);
      if (!handler)
        return;
      const msg = handler(action[1]);
      if (msg instanceof Error)
        return;
      this.#queue.push(msg[0]);
      this.#tick();
    } else if (action instanceof Subscribe) {
      const attrs = keys(this.#onAttributeChange);
      const patch = new Init(attrs, this.#html);
      this.#renderers = this.#renderers.set(action[0], action[1]);
      action[1](patch);
    } else if (action instanceof Unsubscribe) {
      this.#renderers = this.#renderers.delete(action[0]);
    }
  }
  #model;
  #update;
  #queue;
  #view;
  #html;
  #renderers;
  #handlers;
  #onAttributeChange;
  #tick(effects = []) {
    this.#flush(effects);
    const vdom = this.#view(this.#model);
    const diff2 = elements(this.#html, vdom);
    if (!is_empty_element_diff(diff2)) {
      const patch = new Diff(diff2);
      for (const [_, renderer] of this.#renderers) {
        renderer(patch);
      }
    }
    this.#html = vdom;
    this.#handlers = diff2.handlers;
  }
  #flush(effects = []) {
    while (this.#queue.length > 0) {
      const msg = this.#queue.shift();
      const [next, effect] = this.#update(this.#model, msg);
      effects = effects.concat(effect.all.toArray());
      this.#model = next;
    }
    while (effects.length > 0) {
      const effect = effects.shift();
      const dispatch = (msg) => this.send(new Dispatch(msg));
      const emit2 = (event, data) => this.root.dispatchEvent(
        new CustomEvent(event, {
          detail: data,
          bubbles: true,
          composed: true
        })
      );
      const select = () => {
      };
      const root = null;
      effect({ dispatch, emit: emit2, select, root });
    }
    if (this.#queue.length > 0) {
      this.#flush(effects);
    }
  }
};
var start_server_application = LustreServerApplication.start;
var is_browser = () => globalThis.window && window.document;

// build/dev/javascript/lustre/lustre.mjs
var App = class extends CustomType {
  constructor(init4, update2, view5, on_attribute_change) {
    super();
    this.init = init4;
    this.update = update2;
    this.view = view5;
    this.on_attribute_change = on_attribute_change;
  }
};
var ElementNotFound = class extends CustomType {
  constructor(selector) {
    super();
    this.selector = selector;
  }
};
var NotABrowser = class extends CustomType {
};
function application(init4, update2, view5) {
  return new App(init4, update2, view5, new None());
}
function start2(app, selector, flags) {
  return guard(
    !is_browser(),
    new Error(new NotABrowser()),
    () => {
      return start(app, selector, flags);
    }
  );
}

// build/dev/javascript/lustre/lustre/element/html.mjs
function html(attrs, children2) {
  return element("html", attrs, children2);
}
function text2(content) {
  return text(content);
}
function head(attrs, children2) {
  return element("head", attrs, children2);
}
function link(attrs) {
  return element("link", attrs, toList([]));
}
function style2(attrs, css) {
  return element("style", attrs, toList([text2(css)]));
}
function body(attrs, children2) {
  return element("body", attrs, children2);
}
function h1(attrs, children2) {
  return element("h1", attrs, children2);
}
function h2(attrs, children2) {
  return element("h2", attrs, children2);
}
function h3(attrs, children2) {
  return element("h3", attrs, children2);
}
function h4(attrs, children2) {
  return element("h4", attrs, children2);
}
function div(attrs, children2) {
  return element("div", attrs, children2);
}
function li(attrs, children2) {
  return element("li", attrs, children2);
}
function ol(attrs, children2) {
  return element("ol", attrs, children2);
}
function p(attrs, children2) {
  return element("p", attrs, children2);
}
function a(attrs, children2) {
  return element("a", attrs, children2);
}
function b(attrs, children2) {
  return element("b", attrs, children2);
}
function br(attrs) {
  return element("br", attrs, toList([]));
}
function i(attrs, children2) {
  return element("i", attrs, children2);
}
function script(attrs, js) {
  return element("script", attrs, toList([text2(js)]));
}

// build/dev/javascript/lustre_ui/lustre/ui/box.mjs
function of(element2, attributes, children2) {
  return element2(
    prepend(class$("lustre-ui-box"), attributes),
    children2
  );
}
function box(attributes, children2) {
  return of(div, attributes, children2);
}

// build/dev/javascript/lustre_ui/lustre/ui/centre.mjs
function of2(element2, attributes, children2) {
  return element2(
    prepend(class$("lustre-ui-centre"), attributes),
    toList([children2])
  );
}
function centre(attributes, children2) {
  return of2(div, attributes, children2);
}

// build/dev/javascript/lustre_ui/lustre/ui/cluster.mjs
function of3(element2, attributes, children2) {
  return element2(
    prepend(class$("lustre-ui-cluster"), attributes),
    children2
  );
}
function cluster(attributes, children2) {
  return of3(div, attributes, children2);
}
function align_start() {
  return class$("align-start");
}
function align_centre() {
  return class$("align-centre");
}

// build/dev/javascript/lustre_ui/lustre/ui/stack.mjs
function of4(element2, attributes, children2) {
  return element2(
    prepend(class$("lustre-ui-stack"), attributes),
    children2
  );
}
function stack(attributes, children2) {
  return of4(div, attributes, children2);
}

// build/dev/javascript/lustre_ui/lustre/ui.mjs
var Primary = class extends CustomType {
};
var Greyscale = class extends CustomType {
};
var Error2 = class extends CustomType {
};
var Warning = class extends CustomType {
};
var Success = class extends CustomType {
};
function variant(variant2) {
  return attribute(
    "data-variant",
    (() => {
      if (variant2 instanceof Primary) {
        return "primary";
      } else if (variant2 instanceof Greyscale) {
        return "greyscale";
      } else if (variant2 instanceof Error2) {
        return "error";
      } else if (variant2 instanceof Warning) {
        return "warning";
      } else if (variant2 instanceof Success) {
        return "success";
      } else {
        return "info";
      }
    })()
  );
}
var box2 = box;
var centre2 = centre;
var cluster2 = cluster;
var stack2 = stack;

// build/dev/javascript/modem/modem.ffi.mjs
var defaults = {
  handle_external_links: false,
  handle_internal_links: true
};
var initial_location = window?.location?.href;
var do_initial_uri = () => {
  if (!initial_location) {
    return new Error(void 0);
  } else {
    return new Ok(uri_from_url(new URL(initial_location)));
  }
};
var do_init = (dispatch, options = defaults) => {
  document.addEventListener("click", (event) => {
    const a2 = find_anchor(event.target);
    if (!a2)
      return;
    try {
      const url = new URL(a2.href);
      const uri = uri_from_url(url);
      const is_external = url.host !== window.location.host;
      if (!options.handle_external_links && is_external)
        return;
      if (!options.handle_internal_links && !is_external)
        return;
      event.preventDefault();
      if (!is_external) {
        window.history.pushState({}, "", a2.href);
        window.requestAnimationFrame(() => {
          if (url.hash) {
            document.getElementById(url.hash.slice(1))?.scrollIntoView();
          }
        });
      }
      return dispatch(uri);
    } catch {
      return;
    }
  });
  window.addEventListener("popstate", (e) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    const uri = uri_from_url(url);
    window.requestAnimationFrame(() => {
      if (url.hash) {
        document.getElementById(url.hash.slice(1))?.scrollIntoView();
      }
    });
    dispatch(uri);
  });
  window.addEventListener("modem-push", ({ detail }) => {
    dispatch(detail);
  });
  window.addEventListener("modem-replace", ({ detail }) => {
    dispatch(detail);
  });
};
var find_anchor = (el) => {
  if (!el || el.tagName === "BODY") {
    return null;
  } else if (el.tagName === "A") {
    return el;
  } else {
    return find_anchor(el.parentElement);
  }
};
var uri_from_url = (url) => {
  return new Uri(
    /* scheme   */
    url.protocol ? new Some(url.protocol.slice(0, -1)) : new None(),
    /* userinfo */
    new None(),
    /* host     */
    url.hostname ? new Some(url.hostname) : new None(),
    /* port     */
    url.port ? new Some(Number(url.port)) : new None(),
    /* path     */
    url.pathname,
    /* query    */
    url.search ? new Some(url.search.slice(1)) : new None(),
    /* fragment */
    url.hash ? new Some(url.hash.slice(1)) : new None()
  );
};

// build/dev/javascript/modem/modem.mjs
function init2(handler) {
  return from(
    (dispatch) => {
      return guard(
        !is_browser(),
        void 0,
        () => {
          return do_init(
            (uri) => {
              let _pipe = uri;
              let _pipe$1 = handler(_pipe);
              return dispatch(_pipe$1);
            }
          );
        }
      );
    }
  );
}

// build/dev/javascript/personal_site/pages/home.mjs
function view() {
  return p(
    toList([
      class$("center"),
      style(toList([["margin-top", "20px"]]))
    ]),
    toList([
      text(
        "Hi, I'm an undergraduate UWaterloo BCS 27'. I made this website for no reason other than wanting to learn "
      ),
      a(
        toList([
          href("https://gleam.run/"),
          class$("clickable")
        ]),
        toList([text("Gleam")])
      ),
      text(" (which was a great decision!)."),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "On my own time, I'm currently learning about formal language theory (CS 442), topology (Munkres ofc), and boolean algebras with application to analysis (Vladimirov)."
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text("I'm "),
      a(
        toList([
          href("https://github.com/Endolite"),
          class$("clickable")
        ]),
        toList([text("Endolite on GitHub")])
      ),
      text(" and @endolite on Discord.")
    ])
  );
}

// build/dev/javascript/personal_site/pages/resume.mjs
function view2() {
  return div(
    toList([
      class$("center"),
      style(toList([["margin-top", "20px"]]))
    ]),
    toList([
      h1(
        toList([style(toList([["font-size", "16pt"]]))]),
        toList([text("Education")])
      ),
      h2(
        toList([
          style(
            toList([["font-size", "14pt"], ["margin-left", "1em"]])
          )
        ]),
        toList([text("University of Waterloo (BCS 23\u201327)")])
      ),
      h3(
        toList([style(toList([["margin-left", "2em"]]))]),
        toList([text("Courses")])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("MATH 136 \u2013 Linear Algebra 1")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Relaxed introduction to linear algebra I was long overdue for and ended up really liking thanks to its emphasis on proofs"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("MATH 235 \u2013 Linear Algebra 2")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Spent way too long on abstract vector spaces, which is review from the previous course, and then crammed in a bunch of unmotivated computation in the second half; not a great time, but certainly useful for at least one other course"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("MATH 138 \u2013 Calculus 2")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Entirely review, so not much to say; integrals are pretty fun"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("AMATH 231 \u2013 Calculus 4")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Half review and half new material, all of which was computational; a tolerable covering of vector calculus and Fourier series/transforms"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("PMATH 333 \u2013 Introduction to Analysis")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "While this course made me realize that I like analysis more than algebra, it came at the cost really annoying proofs that were quite computational and required a lot of memorization"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("PMATH 351 \u2013 Real Analysis")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Easily my favourite course I've taken so far, covering a lot in depth in a straightforward manner with motivation that never made it feel overly difficult to intuit the progression"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([
          text("PMATH 450 \u2013 Lebesgue Integration and Fourier Analysis")
        ])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Lebesgue integration has been my white whale in math for a long time, and it this course was certainly as difficult as I expected, though maybe moreso due to the Fourier analysis; still really fun even, and finally motivated the material from Linear Algebra 2"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("MATH 249 \u2013 Introduction to Combinatorics")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Lots of fun proofs that made me feel clever and stupid; graph theory was a bit less engaging, though"
          )
        ])
      ),
      br(toList([])),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([
          text("CS 145 \u2013 Introduction to Functional Programming")
        ])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Racket is a fun language, can't wait to use it in the real world; this course really prepared me for making my "
          ),
          a(
            toList([
              href(
                "https://gist.github.com/Endolite/aa8024db78eb546dd36d7ba1be0de34e"
              ),
              class$("clickable")
            ]),
            toList([text("Kanata config")])
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([
          text(
            "CS 146 \u2013 Elementary Algorithm Design and Data Abstraction"
          )
        ])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Course title is the vaguest possible for a CS course, but it was a great well-motivated introduction to imperative programming; now I can pretend to understand compilers"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("CS 241E \u2013 Foundations of Sequential Programs")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Another vague title, but this was focused on implementing abstractions from machine code, going from a verison of MIPS implemeted in Scala to a toy language Lacs with some of Scala's functionality; the final was disproportionately representative language theory, which was my favourite part of the course; now I can pretend to understand compilers a bit more confidently"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("CS 245 \u2013 Logic and Computation")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "I'm more of a math guy, so an introduction to formal logic with some connections to model theory was much appreciated"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("CS 246 \u2013 Object-Oriented Software Development")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Didn't go to a single lecture but still somehow passed; C++ is certainly a language"
          )
        ])
      ),
      br(toList([])),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("ENGL 109 \u2013 Introduction to Academic Writing")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Pretty basic course on academic writing; writing essays is fun, though"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("ENGL 210E \u2013 Genres of Technical Communication")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Another relatively basic course, though it both was more interesting and more tedious"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("JAPAN 201R \u2013 Second-Year Japanese 1")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Decent writing practice, but I didn't learn anything since it just covered the first half of Genki \u2161; I definitely need more speaking practice"
          )
        ])
      ),
      br(toList([])),
      h2(
        toList([
          style(
            toList([["font-size", "14pt"], ["margin-left", "1em"]])
          )
        ]),
        toList([
          text(
            "Lawrence Technological University (Dual Enrollment 22\u201323)"
          )
        ])
      ),
      h3(
        toList([style(toList([["margin-left", "2em"]]))]),
        toList([text("Courses")])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("MCS 2414 \u2013 Calculus 3")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Very straightforward, computational primer on multivariable and vector calculus"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("MCS 2423 \u2013 Differential Equations")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Thoroughly computationally rigorous introduction to differential equations; I gravely oversetimated the imporatnce of differential equations for my career"
          )
        ])
      ),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("MCS 2523 \u2013 Discrete Math")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Sporadic, unrigorous introduction to number theory, enumeration, graph theory, propositional logic, set theory, and discrete probability (in that order?)"
          )
        ])
      ),
      br(toList([])),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("MCS 2514 \u2013 Computer Science 2")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Relaxed introduction to basic C++ and object-oriented programming more generally; my only background was Java, which was slightly suboptimal"
          )
        ])
      ),
      br(toList([])),
      h4(
        toList([style(toList([["margin-left", "3em"]]))]),
        toList([text("PHY 3653 \u2013 Contemporary Physics")])
      ),
      p(
        toList([style(toList([["margin-left", "4em"]]))]),
        toList([
          text(
            "Largely conceptual survey of modern physics, with computation for motivation and simply examples; classical relativity, special relativity, wave-particle duality, quantum mechanics, modelling atoms, nuclear physics, astrophysics, and general relativity"
          )
        ])
      )
    ])
  );
}

// build/dev/javascript/personal_site/pages/writings/tuples.mjs
function view3() {
  return p(
    toList([
      class$("center"),
      style(toList([["text-align", "justify"]]))
    ]),
    toList([
      text(
        "Consider the humble pair, \\((x, y)\\). It's not exactly groundbreaking, but it's not immediately trivial from the ZF axioms either, since a set \\(\\{x, y\\}\\) is inherently unordered. The traditional definition of a pair is\n          \\[(x, y) \\triangleq \\{\\{x\\}, \\{\\{x, y\\}\\}\\]\n      Ah, so a tuple is just a set ordered by inclusion, how simple! Surely, then,\n        \\[(x_i)_{i = 1}^n = \\left\\{\\{x_i\\}_{i = 1}^j\\right\\}_{j = 1}^n\\]\n      This is what I genuinely believed for an embarrassingly long time, but the trouble with this is that an ordered set is "
      ),
      i(toList([]), toList([text("itself ")])),
      text(
        "a pair of a set and a relation, and a relation is also just a set of pairs. We just got past Russell's paradox, so we can't exactly afford any more self-reference. (I know this can be defined as a separate isomorhic entity; that's kind of the point of this, as you'll soon find out.) Tuples are instead recursively defined with nesting (in a manner resembling lists in the \\(\\lambda\\)-calculus):\n        \\[\\begin{align*}\n          (x, y, z) &\\triangleq \\bigl(x, (y, z)\\bigr) \\\\\n            &= \\{\\{x\\}, \\{x, (y, z)\\}\\} \\\\\n            &= \\{\\{x\\}, \\{x, \\{\\{y\\}, \\{y, z\\}\\}\\}\\}\n        \\end{align*}\\]\n      Okay, this isn't the prettiest thing in the world, but it certainly does work. It also implies that Cartesian exponentiation is right-associative, which is interesting. Speaking of which, Cartesian and set exponentiation differ. To see this, let us first review the set-theoretic notions of relations and functions."
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text("A "),
      b(toList([]), toList([text("relation ")])),
      text(
        "with domain \\(X\\) and codomain \\(Y\\) is some\n        \\[R \\subseteq X \\times Y \\triangleq \\{(x, y) \\mid x \\in X, y \\in Y\\}\\]\n      \\(x \\in X\\) is related \\(y \\in Y\\) by \\(R\\) when \\((x, y) \\in R\\). A"
      ),
      b(toList([]), toList([text(" function ")])),
      text(
        "is simply a relation such that each \\(x \\in X\\) is related to exactly one \\(y \\in Y\\) (passing the vertical-line test, so to speak). A\n       "
      ),
      b(toList([]), toList([text("choice function ")])),
      text(
        "on an indexed family of sets \\(\\{X_y\\}_{y \\in Y}\\) is a function \\(f: Y \\to \\bigcup_{y \\in Y} X_y\\) such that each \\(y \\in Y\\) maps to an element of \\(X_y\\); that is, a choice function is a way to "
      ),
      i(toList([]), toList([text("choose ")])),
      text("an element from a given index. The "),
      b(toList([]), toList([text("product ")])),
      text(
        "over the collection is the set of all such choice functions. When each \\(X_y\\) is the same, this can be regarded as the \\(Y\\)-fold product of \\(X\\), or \\(X^Y\\). This is a simply collection of functions \\(f: Y \\to X\\) such that for each \\(y \\in Y\\), \\(f(y) \\in X\\), which happens to characterize functions \\(f: Y \\to X\\). A crucial consideration to make is that natural numbers are themselves sets (as Von Neumann ordinals), defined recursively with \\(0 \\triangleq \\varnothing\\) and \\(n + 1 \\triangleq n \\cup \\{n\\}\\). In general, \\(n = \\{i\\}_{i = 0}^{n - 1}\\), so an element of \\(X^n\\) is a function that takes a natural number less than \\(n\\) and maps it to an element of \\(X\\). (This can be thought of as a 0-index list.) Expaning definitions, this yields\n        \\[X^2 = \\{f \\in \\mathcal{P}(2 \\times X) \\mid \\forall n \\in 2, \\exists! x \\in X, (n, x) \\in f\\}\\]\n      An element of \\(X^2\\) is a function \\(f: 2 \\to X\\) of the form \\(\\{(0, x_0), (1, x_1)\\}\\), which is decidedly not a pair \\((x_0, x_1)\\). This is analogous to a sequence, though, as an element of \\(X^\\mathbb{N}\\). This should be clear from the definition alone, since \\(\\mathbb{N}\\) can be regarded as the limit of \\(n\\) as you keep adding 1, being the union of "
      ),
      i(toList([]), toList([text("all ")])),
      text("natural numbers as opposed to just the first \\(n\\). "),
      i(
        toList([]),
        toList([
          text(
            "(If only there were a convenient term for this exact thing.) "
          )
        ])
      ),
      text(
        "The defiition of exponentiation as a set of finite sequences rather than tuples means that \\(X^n \\subseteq X^*\\), where \\(*\\) is the "
      ),
      b(toList([]), toList([text("Kleene star operator, ")])),
      text(
        "with \\(X^*\\) defined as the set of finite sequences (strings) with elements (characters) in \\(X\\) (the alphabet). "
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text("Maybe we don't even need functions, though. A "),
      b(toList([]), toList([text("strict order relation ")])),
      text(
        " on \\(X\\) is a binary relation \\({<} \\subseteq X \\times X\\) such that for \\(x, y, z \\in X\\),"
      ),
      ol(
        toList([
          style(
            toList([
              ["list-style", "decimal"],
              ["list-style-position", "inside"],
              ["margin-left", "1em"]
            ])
          )
        ]),
        toList([
          li(
            toList([]),
            toList([
              text(
                "exactly one of \\(x < y\\) or \\(y < x\\) is true,"
              )
            ])
          ),
          li(toList([]), toList([text("\\(x \\not< x\\), and")])),
          li(
            toList([]),
            toList([
              text(
                "\\(x < y\\) and \\(y < z\\) implies that \\(x < z\\)."
              )
            ])
          )
        ])
      ),
      text("Pairing \\(X\\) with such an ordering \\(<\\) yields a "),
      b(toList([]), toList([text("strictly ordered set ")])),
      text(
        "\\((X, {<})\\). Not only does this pair require a preexisting definition of a tuple, but so too does the relation, as established above, so while this is perhaps the most straightforward, axiomatic way to define ordering, it cannot be the most foundational one."
      ),
      br(toList([])),
      text(
        "My supposed definition of an \\(n\\)-tuple can be derived from this by letting \\({<} = {\\subseteq}\\) and denoting each set by its first element not in any smaller set (with a choice function!)."
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "It's trivial to see that all of these definitions are equivalent for most purposes, so this amounts to pedantry; while abuse of notation can certainly be an issue in mathematics, it's good to know when to draw the line. I'm no set-theorist, so I think I'll leave it at that."
      )
    ])
  );
}

// build/dev/javascript/personal_site/refresh.ffi.mjs
var refresh = () => {
  window.location.reload();
};

// build/dev/javascript/personal_site/styling.mjs
function hoverable_text(el) {
  return div(
    toList([
      class$(
        "transition-colors duration-200 ease-in-out hover:text-purple-300"
      )
    ]),
    toList([el])
  );
}
var styles = /* @__PURE__ */ toList([
  ["font-family", "CMU Serif"],
  ["font-weight", "575"],
  ["font-size", "13pt"],
  ["color", "White"],
  ["background-color", "#20201E"],
  ["min-height", "100vh"],
  ["height", "100%"],
  ["margin", "0"]
]);
function mathjax_wrapper(page) {
  return html(
    toList([style(styles)]),
    toList([
      head(
        toList([]),
        toList([
          script(
            toList([
              src(
                "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
              ),
              id("MathJax-script")
            ]),
            ""
          ),
          link(
            toList([
              rel("stylesheet"),
              href(
                "https://cdn.jsdelivr.net/gh/bitmaks/cm-web-fonts@latest/fonts.css"
              )
            ])
          ),
          style2(
            toList([]),
            "\n        .clickable {\n          color: #d8b4fe;\n        }\n        .center {\n          margin: auto;\n          max-width: min(700px, 100vw);\n        }\n\n        body {\n          background-color: rgba(0, 0, 0, 0.25)\n        }\n      "
          )
        ])
      ),
      body(
        toList([style(toList([["padding", "20px"]]))]),
        toList([box2(toList([]), toList([page]))])
      )
    ])
  );
}

// build/dev/javascript/personal_site/personal_site.mjs
var Model2 = class extends CustomType {
  constructor(route) {
    super();
    this.route = route;
  }
};
var Home = class extends CustomType {
};
var Resume2 = class extends CustomType {
};
var Writings = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var OnRouteChange = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
function on_route_change(uri) {
  let $ = path_segments(uri.path);
  if ($.hasLength(1) && $.head === "resume") {
    return new OnRouteChange(new Resume2());
  } else if ($.hasLength(2) && $.head === "writings") {
    let title = $.tail.head;
    return new OnRouteChange(new Writings(title));
  } else if ($.hasLength(1) && $.head === "writings") {
    return new OnRouteChange(new Writings(""));
  } else {
    return new OnRouteChange(new Home());
  }
}
function init3(_) {
  return [
    new Model2(
      (() => {
        let $ = (() => {
          let _pipe = do_initial_uri();
          let _pipe$1 = unwrap(_pipe, empty);
          return on_route_change(_pipe$1);
        })();
        {
          let x = $[0];
          return x;
        }
      })()
    ),
    init2(on_route_change)
  ];
}
function view_nav() {
  return box2(
    toList([
      style(
        toList([
          ["display", "flex"],
          ["justify-content", "space-between"],
          ["font-size", "16pt"]
        ])
      ),
      variant(new Primary())
    ]),
    toList([
      hoverable_text(
        a(
          toList([href("/resume")]),
          toList([text("Resume")])
        )
      ),
      hoverable_text(
        a(toList([href("/")]), toList([text("Home")]))
      ),
      hoverable_text(
        a(
          toList([href("/writings")]),
          toList([text("Writings")])
        )
      )
    ])
  );
}
function view_writing(title) {
  let writings = toList([
    [
      "tuples",
      div(
        toList([]),
        toList([
          i(toList([]), toList([text("How")])),
          text(" are tuples?")
        ])
      ),
      view3,
      "2025/03/12"
    ]
  ]);
  let $ = title === "";
  if ($) {
    return centre2(
      toList([
        align_start(),
        style(toList([["margin", "20px"]]))
      ]),
      cluster2(
        toList([]),
        map(
          writings,
          (x) => {
            return div(
              toList([]),
              toList([
                hoverable_text(
                  a(
                    toList([
                      href("/writings/" + x[0]),
                      style(
                        toList([
                          ["position", "fixed"],
                          ["left", "50%"],
                          ["transform", "translate(-200px)"]
                        ])
                      )
                    ]),
                    toList([x[1]])
                  )
                ),
                p(
                  toList([
                    style(
                      toList([
                        ["position", "fixed"],
                        ["left", "50%"],
                        ["transform", "translate(100px)"]
                      ])
                    )
                  ]),
                  toList([text(x[3])])
                )
              ])
            );
          }
        )
      )
    );
  } else {
    return centre2(
      toList([align_centre()]),
      cluster2(
        toList([style(toList([]))]),
        (() => {
          let $1 = filter(writings, (x) => {
            return x[0] === title;
          });
          if ($1.hasLength(1)) {
            let a2 = $1.head;
            return toList([
              h1(
                toList([
                  style(
                    toList([["font-size", "24pt"], ["text-align", "center"]])
                  )
                ]),
                toList([a2[1]])
              ),
              h2(
                toList([
                  style(
                    toList([["font-size", "12pt"], ["text-align", "center"]])
                  )
                ]),
                toList([text(a2[3])])
              ),
              a2[2]()
            ]);
          } else {
            throw makeError(
              "panic",
              "personal_site",
              186,
              "view_writing",
              "`panic` expression evaluated.",
              {}
            );
          }
        })()
      )
    );
  }
}
function view4(model) {
  let page = (() => {
    let $ = model.route;
    if ($ instanceof Resume2) {
      return view2();
    } else if ($ instanceof Writings) {
      let title = $[0];
      return view_writing(title);
    } else {
      return view();
    }
  })();
  return stack2(
    toList([]),
    toList([
      centre2(
        toList([align_start()]),
        cluster2(toList([]), toList([view_nav(), page]))
      )
    ])
  );
}
function update(_, msg) {
  {
    let route = msg[0];
    return [
      new Model2(route),
      (() => {
        refresh();
        return none();
      })()
    ];
  }
}
function main() {
  let app = application(
    init3,
    update,
    (x) => {
      let _pipe = x;
      let _pipe$1 = view4(_pipe);
      return mathjax_wrapper(_pipe$1);
    }
  );
  let $ = start2(app, "#app", void 0);
  if (!$.isOk()) {
    throw makeError(
      "let_assert",
      "personal_site",
      25,
      "main",
      "Pattern match failed, no pattern matched the value.",
      { value: $ }
    );
  }
  return $;
}

// build/.lustre/entry.mjs
main();
