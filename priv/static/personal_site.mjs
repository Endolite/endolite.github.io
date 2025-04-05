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
    for (let i3 = array3.length - 1; i3 >= 0; --i3) {
      t = new NonEmpty(array3[i3], t);
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
      for (let i3 = 0; i3 < wholeByteCount; i3++) {
        if (this.rawBuffer[i3] !== other.rawBuffer[i3]) {
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
      for (let i3 = 0; i3 < wholeByteCount; i3++) {
        const a2 = bitArrayByteAt(this.rawBuffer, this.bitOffset, i3);
        const b2 = bitArrayByteAt(other.rawBuffer, other.bitOffset, i3);
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
  return !(a2 instanceof BitArray) && a2.buffer instanceof ArrayBuffer && a2.BYTES_PER_ELEMENT && !(a2.byteLength === b2.byteLength && a2.every((n, i3) => n === b2[i3]));
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
  for (let i3 = 0; i3 < len; i3++) {
    hash = Math.imul(31, hash) + s.charCodeAt(i3) | 0;
  }
  return hash;
}
function hashNumber(n) {
  tempDataView.setFloat64(0, n);
  const i3 = tempDataView.getInt32(0);
  const j = tempDataView.getInt32(4);
  return Math.imul(73244475, i3 >> 16 ^ i3) ^ j;
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
    for (let i3 = 0; i3 < o.length; i3++) {
      h = Math.imul(31, h) + getHash(o[i3]) | 0;
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
    for (let i3 = 0; i3 < keys2.length; i3++) {
      const k = keys2[i3];
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
  for (let i3 = 0; i3 < len; ++i3) {
    out[i3] = arr[i3];
  }
  out[at] = val;
  return out;
}
function spliceIn(arr, at, val) {
  const len = arr.length;
  const out = new Array(len + 1);
  let i3 = 0;
  let g = 0;
  while (i3 < at) {
    out[g++] = arr[i3++];
  }
  out[g++] = val;
  while (i3 < len) {
    out[g++] = arr[i3++];
  }
  return out;
}
function spliceOut(arr, at) {
  const len = arr.length;
  const out = new Array(len - 1);
  let i3 = 0;
  let g = 0;
  while (i3 < at) {
    out[g++] = arr[i3++];
  }
  ++i3;
  while (i3 < len) {
    out[g++] = arr[i3++];
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
      for (let i3 = 0; i3 < 32; i3++) {
        if ((bitmap & 1) !== 0) {
          const node = root.array[j++];
          nodes[i3] = node;
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
  for (let i3 = 0; i3 < size; i3++) {
    if (isEqual(key, root.array[i3].k)) {
      return i3;
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
      let i3 = 0;
      let j = 0;
      let bitmap = 0;
      while (i3 < idx) {
        const nv = arr[i3];
        if (nv !== void 0) {
          out[j] = nv;
          bitmap |= 1 << i3;
          ++j;
        }
        ++i3;
      }
      ++i3;
      while (i3 < arr.length) {
        const nv = arr[i3];
        if (nv !== void 0) {
          out[j] = nv;
          bitmap |= 1 << i3;
          ++j;
        }
        ++i3;
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
  for (let i3 = 0; i3 < size; i3++) {
    const item = items[i3];
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
    for (let i3 = 0; i3 < keys2.length; i3++) {
      const k = keys2[i3];
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
        for (let i3 = 0, o = data2, e = event; i3 < path.length; i3++) {
          if (i3 === path.length - 1) {
            o[path[i3]] = e[path[i3]];
          } else {
            o[path[i3]] ??= {};
            e = e[path[i3]];
            o = o[path[i3]];
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
  static start({ init: init4, update: update2, view: view9 }, selector, flags) {
    if (!is_browser())
      return new Error(new NotABrowser());
    const root = selector instanceof HTMLElement ? selector : document.querySelector(selector);
    if (!root)
      return new Error(new ElementNotFound(selector));
    const app = new _LustreClientApplication(root, init4(flags), update2, view9);
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
  constructor(root, [init4, effects], update2, view9) {
    this.root = root;
    this.#model = init4;
    this.#update = update2;
    this.#view = view9;
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
  static start({ init: init4, update: update2, view: view9, on_attribute_change }, flags) {
    const app = new _LustreServerApplication(
      init4(flags),
      update2,
      view9,
      on_attribute_change
    );
    return new Ok((action) => app.send(action));
  }
  constructor([model, effects], update2, view9, on_attribute_change) {
    this.#model = model;
    this.#update = update2;
    this.#view = view9;
    this.#html = view9(model);
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
  constructor(init4, update2, view9, on_attribute_change) {
    super();
    this.init = init4;
    this.update = update2;
    this.view = view9;
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
function application(init4, update2, view9) {
  return new App(init4, update2, view9, new None());
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
function div(attrs, children2) {
  return element("div", attrs, children2);
}
function hr(attrs) {
  return element("hr", attrs, toList([]));
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
function ul(attrs, children2) {
  return element("ul", attrs, children2);
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
function cite(attrs, children2) {
  return element("cite", attrs, children2);
}
function i(attrs, children2) {
  return element("i", attrs, children2);
}
function q(attrs, children2) {
  return element("q", attrs, children2);
}
function time(attrs, children2) {
  return element("time", attrs, children2);
}
function img(attrs) {
  return element("img", attrs, toList([]));
}
function script(attrs, js) {
  return element("script", attrs, toList([text2(js)]));
}
function details(attrs, children2) {
  return element("details", attrs, children2);
}
function summary(attrs, children2) {
  return element("summary", attrs, children2);
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
function heading(elem) {
  return h1(
    toList([style(toList([["font-size", "16pt"]]))]),
    toList([elem])
  );
}
function subheading(elem) {
  return h2(
    toList([
      style(toList([["margin-left", "1em"], ["font-size", "14pt"]]))
    ]),
    toList([elem])
  );
}
function subsubheading(elem) {
  return h3(
    toList([style(toList([["margin-left", "2em"]]))]),
    toList([elem])
  );
}
function details2(label2, margin, child) {
  return details(
    toList([style(toList([["margin-left", margin]]))]),
    toList([summary(toList([]), toList([label2])), child])
  );
}
function p_margin(elem) {
  return p(
    toList([style(toList([["margin-left", "1em"]]))]),
    toList([elem])
  );
}
function descriptions(content) {
  return div(
    toList([]),
    map(
      content,
      (x) => {
        {
          let a2 = x[0];
          let b2 = x[1];
          return details2(a2, "1em", p_margin(b2));
        }
      }
    )
  );
}
function view2() {
  let courses_math = map(
    toList([
      [
        "MATH 136 \u2013 Linear Algebra 1",
        "Relaxed introduction to linear algebra I was long overdue for and ended up really liking thanks to its emphasis on proofs"
      ],
      [
        "MATH 235 \u2013 Linear Algebra 2",
        "Spent way too long on abstract vector spaces, which is review from the previous course, and then crammed in a bunch of unmotivated computation in the second half; not a great time, but certainly useful for at least one other course"
      ],
      [
        "MATH 138 \u2013 Calculus 2",
        "Entirely review, so not much to say; integrals are pretty fun"
      ],
      [
        "AMATH 231 \u2013 Calculus 4",
        "Half review and half new material, all of which was computational; a tolerable covering of vector calculus and Fourier series/transforms"
      ],
      [
        "PMATH 333 \u2013 Introduction to Analysis",
        "While this course made me realize that I like analysis more than algebra, it came at the cost really annoying proofs that were quite computational and required a lot of memorization"
      ],
      [
        "PMATH 351 \u2013 Real Analysis",
        "Easily my favourite course I've taken so far, covering a lot in depth in a straightforward manner with motivation that never made it feel overly difficult to intuit the progression"
      ],
      [
        "PMATH 450 \u2013 Lebesgue Integration and Fourier Analysis",
        "Lebesgue integration has been my white whale in math for a long time, and this course was certainly as difficult as I expected, though maybe moreso due to the Fourier analysis; still really fun, and finally motivated the material from Linear Algebra 2"
      ],
      [
        "MATH 249 \u2013 Introduction to Combinatorics",
        "Intro to algebraic combinatorics with lots of fun proofs that made me feel clever and stupid; graph theory was a bit less engaging, though"
      ],
      [
        "STAT 230 \u2013 Probability",
        "Simple introduction to probability with annoying problems and an emphasis on knowing the applicability of distributions; sadly untheoretical, I wanted measure theory ( \u2022 \u1D16 \u2022 \uFF61)"
      ],
      [
        "STAT 231 \u2013 Statistics",
        "Rigorous introduction to theoretical statistics focusing on estimation and emphasizing consciousness of assumptions; also tested R for some reason; lots and lots of memorization, but open-note \u0285(\xB0_\xB0)\u0283"
      ]
    ]),
    (x) => {
      {
        let a2 = x[0];
        let b2 = x[1];
        return [text(a2), text(b2)];
      }
    }
  );
  let courses_cs = map(
    toList([
      [
        "CS 145 \u2013 Introduction to Functional Programming",
        p(
          toList([]),
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
        )
      ],
      [
        "CS 146 \u2013 Elementary Algorithm Design and Data Abstraction",
        text(
          "Course title is the vaguest possible for a CS course, but it was a great well-motivated (if perhaps overly dense) introduction to imperative programming; now I can pretend to understand compilers"
        )
      ],
      [
        "CS 136L \u2013 Tools and Techniques for Software Development",
        text(
          "Intro to tools like Linux and git which are really useful; unfortunately I have dementia (\xB4\uFF1B\u03C9\uFF1B`)"
        )
      ],
      [
        "CS 241E \u2013 Foundations of Sequential Programs",
        text(
          "Another vague title, but this was focused on implementing abstractions from machine code, going from a verison of MIPS implemeted in Scala to a toy language Lacs with some of Scala's functionality; the final was disproportionately representative language theory, which was my favourite part of the course; now I can pretend to understand compilers a bit more confidently"
        )
      ],
      [
        "CS 245 \u2013 Logic and Computation",
        text(
          "I'm more of a math guy, so an introduction to formal logic with some connections to model theory was much appreciated"
        )
      ],
      [
        "CS 246 \u2013 Object-Oriented Software Development",
        text(
          "Didn't go to a single lecture but still somehow passed; C++ is certainly a language"
        )
      ]
    ]),
    (x) => {
      {
        let a2 = x[0];
        let b2 = x[1];
        return [text(a2), b2];
      }
    }
  );
  let courses_other = map(
    toList([
      [
        "ENGL 109 \u2013 Introduction to Academic Writing",
        "Pretty basic course on academic writing; writing essays is fun, though"
      ],
      [
        "ENGL 210E \u2013 Genres of Technical Communication",
        "Another relatively basic course, though it both was more interesting and more tedious"
      ],
      [
        "JAPAN 201R \u2013 Second-Year Japanese 1",
        "Decent writing practice, but I didn't learn anything since it just covered the first half of Genki \u2161; I definitely need more speaking practice"
      ],
      ["MUSIC 116/117 \u2013 Music Ensemble", "I love jazz -=iii=<()"]
    ]),
    (x) => {
      {
        let a2 = x[0];
        let b2 = x[1];
        return [text(a2), text(b2)];
      }
    }
  );
  let courses_ltu = map(
    toList([
      [
        "MCS 2414 \u2013 Calculus 3",
        "Very straightforward, computational primer on multivariable and vector calculus"
      ],
      [
        "MCS 2423 \u2013 Differential Equations",
        "Thoroughly computationally rigorous introduction to differential equations; I gravely oversetimated the imporatnce of differential equations for my career"
      ],
      [
        "MCS 2523 \u2013 Discrete Math",
        "Sporadic, unrigorous introduction to number theory, enumeration, graph theory, propositional logic, set theory, and discrete probability (in that order?)"
      ],
      [
        "MCS 2514 \u2013 Computer Science 2",
        "Relaxed introduction to basic C++ and object-oriented programming more generally; my only background was Java, which was slightly suboptimal"
      ],
      [
        "PHY 3653 \u2013 Contemporary Physics",
        "Largely conceptual survey of modern physics, with computation for motivation and simple examples; classical and special relativity, wave-particle duality, quantum mechanics, modelling atoms, nuclear physics, astrophysics, and general relativity"
      ]
    ]),
    (x) => {
      {
        let a2 = x[0];
        let b2 = x[1];
        return [text(a2), text(b2)];
      }
    }
  );
  return div(
    toList([
      class$("center"),
      style(toList([["margin-top", "20px"]]))
    ]),
    toList([
      heading(text("Education")),
      subheading(text("University of Waterloo (BCS 23\u201327)")),
      subsubheading(text("Courses")),
      details2(text("Math"), "3em", descriptions(courses_math)),
      details2(text("CS"), "3em", descriptions(courses_cs)),
      details2(text("Electives"), "3em", descriptions(courses_other)),
      subheading(
        text(
          "Lawrence Technological University (Dual Enrollment 22\u201323)"
        )
      ),
      details2(text("Courses"), "2em", descriptions(courses_ltu))
    ])
  );
}

// build/dev/javascript/personal_site/pages/writings/authority_despair_michigan.mjs
function view3() {
  return p(
    toList([
      class$("center"),
      style(toList([["text-align", "justify"]]))
    ]),
    toList([
      text(
        "I don't know whether it's part of human nature to defer to authority or if we're socialized to be this way. It's hopelessly easy to be pessimistic about humanity, but I think that largely comes down to the fact that those with power are the most vocal by social construction. The history of the West is, to my (admittedly little) knowledge, a story of a few people doing "
      ),
      i(toList([]), toList([text("something ")])),
      text(
        "to rationalize their power as the natural order, be it through religion, eugenics, or capitalism; by presenting a single source of authority that's advantageous to themselves, they consolidate power until that status quo is inevitably challenged, at which point conflict dictates whose turn is next to be at the top of the pecking order. So if human nature is truly compassionate, how does this cycle remain unbroken?"
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "When faced with despair, you can only do so much to cope. Dissociating isn't all too productive, so eventually, some decision must be made to continue on. Rejecting the status quo requires action, which is often difficult and dangerous. Of course, collective action is safer, but when people act purely in their own interest, they aren't exactly wont to do something that draws their very existence into question. The notion of existence I refer to here is not the state of living but rather the state of perceived stability on a micro level\u2014a life without risk of significant interruption, good or bad. As long as you can find "
      ),
      i(toList([]), toList([text("something ")])),
      text(
        "you don't want to give up, you can justify doing nothing under the guise of protecting what little you have. After all, why risk it if you'll potentially be rewarded for staying docile, be it in this life or the next? If enough people can rationalize their own condition, good or bad, significant revolt can be suppressed, since organizing becomes much more difficult with lesser numbers."
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "Anything can be justified through deference: if you're not the one making the final judgement\u2014if you're just doing your best in someone else's world\u2014you're shielded from your complicity. Having individuals as figureheads allows misgivings of the system to be attributed to a few bad actors rather than the system itself, again rationalizing its perpetuation. When a society is complicit, to act against the system is to act without thinking of the harm that could be brought to others through said action, so it's never deontologically viable to risk it."
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "This transfer of guilt to the authority of a higher power\u2014be it God, the natural order, or the economy\u2014from those responsible for and benefitting from the source of said guilt is what allows an exploitative system to keep functioning. This abstraction away from humanity towards a projection of true authority directly justifies and rewards a lack of empathy. But even still, kind people can always be found. And progress can always be made, no matter how gradual."
      ),
      hr(
        toList([
          style(
            toList([["margin-top", "0.5em"], ["margin-bottom", "0.5em"]])
          )
        ])
      ),
      img(
        toList([
          src(
            "\n            https://f4.bcbits.com/img/a3087694239_10.jpg"
          ),
          style(
            toList([["max-height", "350px"], ["padding", "20px"]])
          ),
          class$("center")
        ])
      ),
      text("Sufjan Steven's 2003 album "),
      cite(toList([]), toList([text("Michigan ")])),
      text("starts on a somber note with "),
      cite(
        toList([]),
        toList([text("Flint (For the Unemployed and Underpaid)")])
      ),
      text(
        ", painting a picture of a Flint resident's embrace of emptiness. Its instrumentation is fittingly sparse, with accompaniment mostly coming from piano and heavily reverbed trumpet. The latter instrument builds with repetition of the lyric "
      ),
      q(toList([]), toList([text("Even if I died alone")])),
      text(
        " to express resignation to and eventual proclamation of this line."
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text("The subsequent "),
      cite(
        toList([]),
        toList([
          text(
            "All Good Naysayers, Speak Up! Or Forever Hold Your Peace!"
          )
        ])
      ),
      text(
        " introduces the other aspect to this recurring dialogue with the pathological appeal deficiencies in society as they are ("
      ),
      q(
        toList([]),
        toList([
          text(
            "Often not the state is advocation/If we forma power of recognition"
          )
        ])
      ),
      text(", "),
      q(
        toList([]),
        toList([
          text(
            "Entertain ideas of great communion/Shelter not materials in union"
          )
        ])
      ),
      text(
        "). It makes no call to action beyond acknowledgement, and its innocent motivation is accentuated by the exclamation in the title and the song itself's jaunty 5/4. This pseudo-na\xEFvet\xE9 continues into the reminiscence and appreciation of "
      ),
      cite(toList([]), toList([text("Say Yes! to M!ch!gan!")])),
      text("."),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "Facing the bleakness of reality can lead to the empty despair described in "
      ),
      cite(toList([]), toList([text("Flint")])),
      text(" as exemplified by the end of "),
      cite(toList([]), toList([text("The Upper Peninsula")])),
      text(
        " with the panicking synth rising in prominence from the line "
      ),
      q(
        toList([]),
        toList([
          text(
            "I lost my mind, I lost my life/I lost my job, I lost my wife"
          )
        ])
      ),
      text(
        " until suddenly giving way to a gentle guitar chord, as though abruptly resigning."
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      cite(
        toList([]),
        toList([
          text(
            "Oh Detroit, Lift Up Your Weary Head! (Rebuild! Restore! Reconsider!)"
          )
        ])
      ),
      text(
        " is perhaps the most direct look at reality, taking a more detached and cynical tone in observance of the ruin wrought on Detroit through the intense proliferation and stark abandonment of industry, returning to the upbeat 5/4 of "
      ),
      cite(toList([]), toList([text("All Good Naysayers")])),
      text(" in an almost mocking contrast."),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text("The more laid-back "),
      cite(
        toList([]),
        toList([text("Sleeping Bear, Sault Ste. Marie")])
      ),
      text(
        " expresses not frustration but rather counsel, expressing hope for God's "
      ),
      q(toList([]), toList([text("perfect design")])),
      text(
        " before eventually pleading with nature, reflecting on the forgotten pain of the buried Surgeon Bay and the drowned of Saint Marie. "
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text("The proceeding "),
      cite(
        toList([]),
        toList([
          text(
            "They Also Mourn Who Do Not Wear Black (For the Homeless in Muskegon)"
          )
        ])
      ),
      text(
        " returns to a more hopeful place, seeing the justification for perpetual mourning and apathy and using it to instead choose to at least attempt to motivate change for the better; rather than waiting for something better in the next life, the system of the advantageous is criticized for preventing growth and societal actualization altogether in the name of their own interests ("
      ),
      q(
        toList([]),
        toList([
          text(
            "If the advantageous/Reprimand misgivings/We won't grow/We will not ever know"
          )
        ])
      ),
      text("). The final proclamation of "),
      q(
        toList([]),
        toList([text("Lift my life in healthy places!")])
      ),
      text(" asserts the intent to at least do something."),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      cite(
        toList([]),
        toList([
          text(
            "Oh God Where Are You Now? (In Pickerel Lake? Pigeon? Marquette? Mackinaw?)"
          )
        ])
      ),
      text(
        " nonetheless searches again for divine comfort and judgement while the narrator questions the relationship between their own perception of righteousness and that of God's ("
      ),
      q(toList([]), toList([text("Oh God, hold me now")])),
      text(", "),
      q(
        toList([]),
        toList([
          text(
            "Would the righteous still remain?/Would my body stay the same?"
          )
        ])
      ),
      text(") in light of the pleading in "),
      cite(toList([]), toList([text("Sleeping Bear")])),
      text("."),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(" This respite is beautifully offered by "),
      cite(toList([]), toList([text("Vito's Ordination Song")])),
      text(" ("),
      q(
        toList([]),
        toList([
          text(
            "Rest in my arms/Sleep in my bet/There's a design/To what I did and said"
          )
        ])
      ),
      text(
        "), quelling the prior doubt by asserting that all is as ordained by universal, divine love, and serving as a cathartic epilogue of sorts to the album. Repeating this like a mantra, this expresses an internal resolution and restored faith, despite it all."
      ),
      hr(
        toList([
          style(
            toList([["margin-top", "0.5em"], ["margin-bottom", "0.5em"]])
          )
        ])
      ),
      img(
        toList([
          src(
            "\n            https://imagescdn.juno.co.uk/full/CS788496-01A-BIG.jpg"
          ),
          style(
            toList([["max-height", "350px"], ["padding", "20px"]])
          ),
          class$("center")
        ])
      ),
      text("The 2004 follow-up "),
      cite(toList([]), toList([text("Seven Swans")])),
      text(" is not the canonical sequel to "),
      cite(toList([]), toList([text("Michigan")])),
      text(" (that title goes to the seminal 2005 work "),
      cite(toList([]), toList([text("Illinois")])),
      text(
        "), but its even more overt Christian themes serve as a fearful yet accepting reflection of the journey of the prior album. "
      ),
      cite(
        toList([]),
        toList([
          text("All the Trees of the Field Will Clap Their Hands ")
        ])
      ),
      text("kicks off in a darker place than "),
      cite(toList([]), toList([text("Flint")])),
      text(" both musically and lyrically ("),
      q(
        toList([]),
        toList([text("If I am alive this time next year")])
      ),
      text(
        ") but defers to the divine despite expressed concern over whether they are on the right side of the outcome ("
      ),
      q(
        toList([]),
        toList([
          text(
            "And will I be invited to the sound?/And will I be a part of what you've made?"
          )
        ])
      ),
      text(") similarly to "),
      cite(
        toList([]),
        toList([text("Oh God Where Are You Now?")])
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text("In accordance with this, "),
      cite(
        toList([]),
        toList([text("In The Devil's Territory")])
      ),
      text(
        " matter-of-factly dubs the world as having already fallen, portending the end of times as something inevitable to be anticipated ("
      ),
      q(
        toList([]),
        toList([
          text(
            "Be still and know your sign/The beast will arrive in time"
          )
        ])
      ),
      text(
        ") yet maintaining a placid tone, seeing this as an opportunity to meet God rather than as a threat ("
      ),
      q(
        toList([]),
        toList([
          text(
            "We stayed a long, long time/But I'm not afraid to die/To see you/To meet you/To see you/At last"
          )
        ])
      ),
      text(
        ") aided by the light banjo, ephemeral vocals, and whistling synths. "
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "The subsequent few tracks exemplify the overt Christian theming with direct gratitude towards Jesus and Abraham. "
      ),
      cite(
        toList([]),
        toList([text("We Won't Need Legs To Stand")])
      ),
      text(
        " looks forward to the burdenless afterlife as a final reward for the unchanging present, approaching the subject with a dark yet optimistically resolvent tone. Inversely, "
      ),
      cite(
        toList([]),
        toList([text("A Good Man Is Hard To Find")])
      ),
      text(
        " displays an acceptance of Hell as a result of failing to satisfactorily better oneself after costing another ("
      ),
      q(
        toList([]),
        toList([
          text(
            "And so I go to Hell/I wait for it but someone's left me creased"
          )
        ])
      ),
      text(
        ") in so doing casting doubt on the innocence of all complicit in the system through comparison ("
      ),
      q(
        toList([]),
        toList([text("Once in the backyard/She was once like me")])
      ),
      text(
        "). The gravitas of this seeming contradiction is hauntingly emphasized by the detuned vocals present in the bridge."
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text("The title track capitalizes on this by recalling "),
      cite(
        toList([]),
        toList([text("In The Devil's Territory")])
      ),
      text(", actually showing the judgement alluded to ("),
      q(
        toList([]),
        toList([
          text(
            "I saw a sign in the sky/Seven horns, Seven horns, Seven horns"
          )
        ])
      ),
      text(
        "). The vocals cycle between rising hopefully and falling back down, quieting to a whisper. After reassurance of God's presence comes a grave proclamation of omnipotence that communicates universal compassion in a manner akin to a threat ("
      ),
      q(
        toList([]),
        toList([
          text(
            "He will take you/If you run, He will chase you/'Cause He is the Lord"
          )
        ])
      ),
      text(
        ") with a correspondingly booming piano part, Sufjan's icy falsetto sitting above the dark, swirling colours evoking fate, finally resolving peacefully."
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      cite(toList([]), toList([text("The Transfiguration")])),
      text(
        ", the final track, is more upbeat (with a melody eventually evoked by "
      ),
      cite(toList([]), toList([text("Chicago")])),
      text(
        "), being told from the perspective of a truly benevolent deity tending to humanity as a parent ("
      ),
      q(
        toList([]),
        toList([
          text("Lost in the cloud, a voice/Lamb of God, we draw near")
        ])
      ),
      text(")."),
      hr(
        toList([
          style(
            toList([["margin-top", "0.5em"], ["margin-bottom", "0.5em"]])
          )
        ])
      ),
      text(
        "In my eyes, these albums exemplify the relationship between hope, faith, fear, despair, and authority. Power structures serve both to pull us up and to put us back down, and it is up to us to figure out how to respond to that. In a vacuum, faith is easy to sustain, as there is no alternative. Even when other options are present, sufficient propagandization can warp reality to the point that they aren't seriously observed. This alone is enough for many; they choose to view the advancement of humanity as a result of these systems rather than an induced side effect that was produced in spite of them."
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "Choosing to be blind to alternatives is one thing, but there's only so much that can be done to deny immediate reality. Again, those for and against the system are mutually opposed, each attributing deficiencies to the other in a stalemate that benefits the former by virtue of incumbency. Dissatisfaction with the status quo leads very quickly to apathy, which is of course untenable. If this yields despair, the status quo is unchanged; further, this despair may beget even deeper devotion out of othering and deflection. "
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "It's always in the best interest of those in power to make themselves out to be the natural leaders. Blind acceptance is often the simplest option when it comes to complex issues made only more complex by intentional muddying of the waters due to the impossibility of a third party without some vested interest. This has always been true and will always be true for as long as there is a ruling class. But that doesn't make it okay to do nothing; from the throes of despair, the fact that getting here is possible "
      ),
      i(toList([]), toList([text("despite")])),
      text(" its historical constancy is proof enough to recover.")
    ])
  );
}
function meta(acc) {
  return prepend(
    [
      "authority_despair_michigan",
      "Authority, Despair, and M!ch!gan!",
      text("Authority, Despair, and M!ch!gan!"),
      view3,
      "2025-03-13"
    ],
    acc
  );
}

// build/dev/javascript/personal_site/styling.mjs
function br2(size) {
  return br(toList([style(toList([["margin-bottom", size]]))]));
}
function equation(text3) {
  return div(
    toList([class$("equation")]),
    toList([text(text3)])
  );
}
function i2(text3) {
  return i(toList([]), toList([text(text3)]));
}
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
function hr2() {
  return hr(
    toList([
      style(
        toList([["margin-top", "0.5em"], ["margin-bottom", "0.5em"]])
      )
    ])
  );
}
function href_text(llink, ttext) {
  return a(
    toList([href(llink), class$("clickable")]),
    toList([text(ttext)])
  );
}
var styles = /* @__PURE__ */ toList([
  ["font-family", "Computer Modern Serif !important"],
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
              attribute("type", "text/css"),
              href(
                "https://cdn.jsdelivr.net/gh/bitmaks/cm-web-fonts@latest/fonts.css"
              )
            ])
          ),
          style2(
            toList([]),
            "\n        .clickable {\n          color: #d8b4fe;\n        }\n        .center {\n          margin: auto;\n          max-width: min(1000px, 90vw);\n        }\n        a:hover {\n          text-decoration: underline;\n        }\n        .element {\n            font-feature-settings: 'liga' 1;\n            -webkit-font-feature-settings: 'liga' 1;\n            text-rendering: optimizeLegibility;\n        }\n        .equation {\n          width: 100%;\n          overflow-x: auto;\n          white-space:nowrap;\n        }\n      "
          )
        ])
      ),
      body(
        toList([style(toList([["padding", "20px"]]))]),
        toList([
          box2(
            toList([]),
            toList([
              div(
                toList([
                  style(
                    toList([["max-height", "0"], ["color", "rgba(0, 0, 0, 0)"]])
                  )
                ]),
                toList([
                  text(
                    "\\(\n          \\require{action}\n          \\require{boldsymbol}\n          \\require{bussproofs}\n          \\require{cases}\n          \\require{centernot}\n          \\require{mathtools}\n          \\require{mhchem}\n          \\require{physics}\n          \\require{upgreek}\n          \\require{verb}\n\n          % Categories\n            \\DeclareMathOperator{\\Aut}{Aut}\n            \\DeclareMathOperator{\\End}{End}\n            \\DeclareMathOperator{\\hom}{hom}\n            \\DeclareMathOperator{\\Iso}{Iso}\n            \\DeclareMathOperator{\\ob}{ob}\n            \\newcommand{\\op}[1]{#1^{\\text{op}}}\n            % Arrows\n              \\DeclareMathOperator{\\lff}{\\leftrightsquigarrow}\n              \\DeclareMathOperator{\\lrar}{\\leftrightarrow}\n              \\DeclareMathOperator{\\hra}{\\hookrightarrow}\n              \\DeclareMathOperator{\\impto}{\\dashrightarrow}\n              \\DeclareMathOperator{\\opto}{\\leftrightarrows}\n              \\DeclareMathOperator{\\parto}{\\rightrightarrows}\n              \\DeclareMathOperator{\\qlff}{\\quad\\lff\\quad}\n              \\DeclareMathOperator{\\qlto}{\\quad\\leadsto\\quad}\n              \\DeclareMathOperator{\\rat}{\\rightarrowtail}\n              \\DeclareMathOperator{\\rest}{{\\restriction}}\n              \\DeclareMathOperator{\\rsq}{\\rightsquigarrow}\n              \\DeclareMathOperator{\\thra}{\\twoheadrightarrow}\n              % Labelled arrows\n                \\newcommand{\\xto}[1]{\\xrightarrow{#1}}\n          % Combinatorics\n            \\DeclareMathOperator{\\cyc}{cyc}\n            \\DeclareMathOperator{\\Des}{Des}\n            \\DeclareMathOperator{\\des}{des}\n            \\newcommand{\\en}[2]{\\genfrac{\\langle}{\\rangle}{0pt}{}{#1}{#2}}\n            \\DeclareMathOperator{\\girth}{girth}\n            \\DeclareMathOperator{\\maj}{maj}\n            \\DeclareMathOperator{\\inv}{inv}\n            \\DeclareMathOperator{\\indeg}{indeg}\n            \\newcommand{\\multi}[2]{\\left(\\kern-.3em\\left(\\genfrac{}{}{0pt}{}{#1}{#2}\\right)\\kern-.3em\\right)}\n            \\newcommand{\\npr}[2]{#1^{\\qty\\(#2)}}\n            \\DeclareMathOperator{\\outdeg}{outdeg}\n            \\DeclareMathOperator{\\per}{per}\n            \\DeclareMathOperator{\\stimes}{\\mathbin{\\square}}\n          % CS\n            \\DeclareMathOperator{\\BV}{BV}\n            \\DeclareMathOperator{\\Da}{\\Downarrow}\n            \\DeclareMathOperator{\\depth}{depth}\n            \\newcommand{\\evit}[1]{\\ev{\\tit{#1}}}\n            \\newcommand{\\evt}[1]{\\ev{\\t{#1}}}\n            \\DeclareMathOperator{\\FV}{FV}\n            \\newcommand{\\hoare}[3]{\\qty(\\abs{#1})#2\\qty(\\abs{#3})}\n            \\newcommand{\\lop}[3]{(\\(#1\\) \\(#2\\) \\(#3\\))}\n            \\newcommand{\\lopt}[3]{\\text{(\\(\\#1\\) \\(#2\\) \\(#3\\))}}\n            \\DeclareMathOperator{\\rename}{rename}\n            \\newcommand{\\rep}[1]{\\texttt{\u27E6#1\u27E7}}\n            \\newcommand{\\repm}[1]{\u27E6#1\u27E7}\n            \\DeclareMathOperator{\\step}{step}\n          % Differentials\n            \\newcommand{\\vnabla}{\\vec{\\nabla}}\n          % Functions\n            \\DeclareMathOperator{\\cis}{cis}\n            \\newcommand{\\ceil}[1]{\\left\\lceil #1 \\right\\rceil}\n            \\DeclareMathOperator{\\erfc}{erfc}\n            \\newcommand{\\floor}[1]{\\left\\lfloor #1 \\right\\rfloor}\n            \\DeclareMathOperator{\\supp}{supp}\n            \\DeclareMathOperator{\\sgn}{sgn}\n            \\DeclareMathOperator{\\sinc}{sinc}\n            \\DeclareMathOperator{\\Uscr}{\\mathscr{U}}\n            % Transforms\n              \\DeclareMathOperator{\\Ell}{\\mathscr{L}}\n              \\DeclareMathOperator{\\id}{id}\n          % Geometry\n            \\DeclareMathOperator{\\vol}{vol}\n          % Groups\n            \\DeclareMathOperator{\\aut}{aut}\n            \\DeclareMathOperator{\\Hom}{Hom}\n            \\DeclareMathOperator{\\lcm}{lcm}\n            \\DeclareMathOperator{\\ord}{ord}\n            % Rings\n              \\DeclareMathOperator{\\char}{char}\n          % Integrals\n            \\newcommand{\\oiint}{{\\subset\\!\\supset} \\llap{\\iint}}\n            \\newcommand{\\oiiint}{{\\large{\\subset\\!\\supset}} \\llap{\\iiint}}\n            \\newcommand{\\Ft}{\\mathcal{F}}\n          % Lamina\n            \\newcommand{\\bbar}[1]{\\bar{\\bar{#1}}}\n          % Logic\n            \\DeclareMathOperator{\\Atom}{Atom}\n            \\DeclareMathOperator{\\CNF}{CNF}\n            \\DeclareMathOperator{\\DNF}{DNF}\n            \\DeclareMathOperator{\\Form}{Form}\n            \\DeclareMathOperator{\\Func}{Func}\n            \\newcommand{\\simp}{\\Longrightarrow}\n            \\newcommand{\\smp}{\\Rightarrow}\n            \\newcommand{\\siff}{\\Longleftrightarrow}\n            \\newcommand{\\sff}{\\Leftrightarrow}\n            \\newcommand{\\seq}{\\vdash\\!\\dashv}\n            \\DeclareMathOperator{\\Sent}{Sent}\n            \\DeclareMathOperator{\\Term}{Term}\n            \\DeclareMathOperator{\\Th}{Th}\n            \\newcommand{\\teq}{\\models\\!\\mid}\n          % Matrices\n            \\DeclareMathOperator{\\adj}{adj}\n            \\DeclareMathOperator{\\Col}{Col}\n            \\DeclareMathOperator{\\diag}{diag}\n            \\DeclareMathOperator{\\Null}{null}\n            \\DeclareMathOperator{\\nullity}{nullity}\n            \\DeclareMathOperator{\\REF}{REF}\n            \\newcommand{\\row}[1]{\\overrightarrow{\\mathrm{row}_{#1}}}\n            \\DeclareMathOperator{\\Row}{Row}\n            \\DeclareMathOperator{\\RREF}{RREF}\n          % Measure Theory\n            \\DeclareMathOperator{\\Bor}{Bor}\n            \\DeclareMathOperator{\\esssup}{ess\\sup}\n            \\DeclareMathOperator{\\Simp}{S{\\small IMP}}\n            \\DeclareMathOperator{\\Step}{S{\\small TEP}}\n            \\DeclareMathOperator{\\Trig}{Trig}\n          % Numbers\n            \\let\\Im\\relax\n            \\DeclareMathOperator{\\Im}{Im}\n            \\let\\Re\\relax\n            \\DeclareMathOperator{\\Re}{Re}\n          % Probability/Statistics\n            \\DeclareMathOperator{\\AUC}{AUC}\n            \\DeclareMathOperator{\\Bias}{Bias}\n            \\DeclareMathOperator{\\Cov}{Cov}\n            \\DeclareMathOperator{\\Exp}{\\mathbb{E}}\n            \\newcommand{\\IQR}{\\mathrm{IQR}}\n            \\DeclareMathOperator{\\loss}{loss}\n            \\DeclareMathOperator{\\median}{median}\n            \\DeclareMathOperator{\\MSE}{MSE}\n            \\DeclareMathOperator{\\SSE}{SSE}\n            \\DeclareMathOperator{\\sd}{sd}\n            \\DeclareMathOperator{\\Var}{Var}\n            % ISDs\n              \\DeclareMathOperator{\\BS}{BS}\n              \\DeclareMathOperator{\\IBS}{IBS}\n              \\DeclareMathOperator{\\KM}{KM}\n            % Distributions\n              \\DeclareMathOperator{\\1}{\\mathbb{1}}\n              \\DeclareMathOperator{\\Binomial}{Bin}\n              \\DeclareMathOperator{\\Bin}{Bin}\n              \\DeclareMathOperator{\\Exponential}{Exp}\n              \\DeclareMathOperator{\\Expo}{Exp}\n              \\DeclareMathOperator{\\Geometric}{Geom}\n              \\DeclareMathOperator{\\Geom}{Geom}\n              \\DeclareMathOperator{\\Hypergeometric}{Hyp}\n              \\DeclareMathOperator{\\Hyp}{Hyp}\n              \\DeclareMathOperator{\\Multinomial}{Mult}\n              \\DeclareMathOperator{\\Mult}{Mult}\n              \\DeclareMathOperator{\\NB}{NB}\n              \\DeclareMathOperator{\\Norm}{\\mathcal{N}}\n              \\DeclareMathOperator{\\Poisson}{Pois}\n              \\DeclareMathOperator{\\Pois}{Pois}\n              \\DeclareMathOperator{\\Uniform}{Uniform}\n            % Tests\n              \\newcommand{\\pval}{p\\text{-value}}\n          % Relations\n            \\DeclareMathOperator{\\codom}{codom}\n            \\DeclareMathOperator{\\dom}{dom}\n            \\DeclareMathOperator{\\field}{field}\n            \\DeclareMathOperator{\\graph}{graph}\n            \\DeclareMathOperator{\\ran}{ran}\n            \\newcommand{\\treq}{\\triangleq}\n            % Arrows\n              \\newcommand{\\lrarr}{\\leftrightarrow}\n              \\newcommand{\\Lrarr}{\\Leftrightarrow}\n          % Sets\n            \\newcommand{\\cmp}{\\mathsf{c}}\n            \\DeclareMathOperator{\\glb}{glb}\n            \\DeclareMathOperator{\\lub}{lub}\n            \\newcommand{\\Mid}{\\hspace{1.25mm}\\middle|\\hspace{1.25mm}}\n            \\renewcommand{\\P}{\\mathcal{P}}\n            \\DeclareMathOperator{\\Perm}{Perm}\n            \\DeclareMathOperator{\\sdf}{\\mathbin{\\triangle}}\n            \\newcommand{\\sub}{\\subset}\n            \\newcommand{\\sube}{\\subseteq}\n            \\newcommand{\\supe}{\\supseteq}\n          % Sequences\n            \\DeclareMathOperator{\\LIM}{LIM}\n            \\DeclareMathOperator*{\\liminf}{\\mathop{\\lim\\inf}}\n            \\DeclareMathOperator*{\\limsup}{\\lim\\sup}\n          % Topology\n            \\DeclareMathOperator{\\Cl}{Cl}\n            \\DeclareMathOperator*{\\boxtop}{\\square}\n            \\DeclareMathOperator{\\diam}{diam}\n            \\DeclareMathOperator{\\dist}{dist}\n            \\DeclareMathOperator{\\Ext}{Ext}\n            \\DeclareMathOperator{\\ext}{ext}\n            \\DeclareMathOperator{\\Int}{Int}\n          % Vectors\n            \\DeclareMathOperator{\\comp}{comp}\n            \\newcommand{\\coord}[3]{{}_{#1}\\qty[#2]_{#3}}\n            \\renewcommand{\\curl}{\\mathrm{curl}}\n            \\DeclareMathOperator{\\divg}{div}\n            \\newcommand{\\norms}[1]{\\left|\\!\\left|\\!\\left|#1\\right|\\!\\right|\\!\\right|}\n            \\newcommand{\\normt}[1]{\\Vert #1 \\Vert}\n            \\DeclareMathOperator{\\orth}{orth}\n            \\DeclareMathOperator{\\proj}{proj}\n            \\DeclareMathOperator{\\span}{span}\n            \\renewcommand{\\Vec}[1]{\\overrightarrow{#1}}\n\n          % Symbols\n            % Sets\n              \\newcommand{\\A}{\\mathcal{A}}\n              \\DeclareMathOperator{\\B}{\\mathcal{B}}\n              \\newcommand{\\BB}{\\mathcal{B}}\n              \\newcommand{\\C}{\\mathbb{C}}\n              \\newcommand{\\CC}{\\mathcal{C}}\n              \\newcommand{\\D}{\\mathcal{D}}\n              \\newcommand{\\F}{\\mathbb{F}}\n              \\newcommand{\\G}{\\mathcal{G}}\n              \\newcommand{\\H}{\\mathbb{H}}\n              \\newcommand{\\Hs}{\\mathcal{H}}\n              \\newcommand{\\I}{\\mathbb{I}}\n              \\newcommand{\\J}{\\mathcal{J}}\n              \\newcommand{\\K}{\\mathbb{K}}\n              \\newcommand{\\Kc}{\\mathcal{K}}\n              \\newcommand{\\L}{\\mathcal{L}}\n              \\newcommand{\\M}{\\mathcal{M}}\n              \\newcommand{\\N}{\\mathbb{N}}\n              \\DeclareMathOperator{\\O}{\\mathcal{O}}\n              \\newcommand{\\Q}{\\mathbb{Q}}\n              \\newcommand{\\Qc}{\\mathcal{Q}}\n              \\newcommand{\\R}{\\mathbb{R}}\n              \\newcommand{\\RR}{\\mathcal{R}}\n              \\renewcommand{\\S}{\\mathbb{S}}\n              \\newcommand{\\SS}{\\mathcal{S}}\n              \\newcommand{\\T}{\\mathbb{T}}\n              \\newcommand{\\U}{\\mathcal{U}}\n              \\newcommand{\\V}{\\mathbb{V}}\n              \\newcommand{\\W}{\\mathbb{W}}\n              \\newcommand{\\Ws}{\\mathcal{W}}\n              \\newcommand{\\X}{\\mathfrak{X}}\n              \\newcommand{\\Y}{\\mathfrak{Y}}\n              \\newcommand{\\Z}{\\mathbb{Z}}\n              % Cardinality\n                \\newcommand{\\cf}{\\mathfrak{c}}\n              % Topology\n                \\newcommand{\\Fm}{\\mathrm{F}}\n                \\newcommand{\\Gm}{\\mathrm{G}}\n            % Greek Letters\n              \\newcommand{\\Alpha}{\\mathrm{A}}\n              \\newcommand{\\emf}{\\mathcal{E}}\n              \\newcommand{\\Iota}{\\mathrm{I}}\n              \\newcommand{\\Mu}{\\mathrm{M}}\n              \\newcommand{\\Tau}{\\mathcal{T}}\n          % Vectors\n            \\newcommand{\\vps}{\\hspace{0.5mm}}\n            % Unit Vectors\n              \\newcommand{\\vi}{\\text{\\^i}}\n              \\newcommand{\\vj}{\\text{\\^j}}\n              \\newcommand{\\vk}{\\text{\\^k}}\n              \\newcommand{\\vr}{\\hat{r}}\n              \\newcommand{\\vphi}{\\hat{\\varphi}}\n\n          % Miscellaneous/Utilities\n            \\newcommand{\\and}{\\text{ and }}\n            \\newcommand{\\And}{\\qquad \\text{and} \\qquad}\n            \\newcommand{\\andown}[2]{\\underset{#2}{\\underbrace{#1}}}\n            \\newcommand{\\anup}[2]{\\overset{#2}{\\overbrace{#1}}}\n            \\newcommand{\\bb}[1]{\\mathbb{#1}}\n            \\newcommand{\\bf}[1]{\\textbf{#1}}\n            \\newcommand{\\bs}[1]{\\boldsymbol{#1}}\n            \\renewcommand{\\cal}[1]{\\mathcal{#1}}\n            \\newcommand{\\clabel}[2]{\\begin{array}{c} #1 \\ #2 \\end{array}}\n            \\newcommand{\\enquote}[1]{``#1''}\n            \\newcommand{\\hsp}[1]{\\hspace{#1}}\n            \\newcommand{\\mb}[1]{\\mathbin{#1}}\n            \\renewcommand{\\not}{\\centernot}\n            \\newcommand{\\oline}[1]{\\overline{#1}}\n            \\renewcommand{\\rm}[1]{\\mathrm{#1}}\n            \\newcommand{\\sc}[1]{{\\small #1}}\n            \\renewcommand{\\sf}[1]{\\textsf{#1}}\n            \\newcommand{\\subt}[2]{#1_{\\text{#2}}}\n            \\newcommand{\\subttt}[2]{#1_{\\texttt{#2}}}\n            \\newcommand{\\supt}[2]{#1^{\\text{#2}}}\n            \\newcommand{\\system}[1]{\\left\\{\\begin{aligned}#1\\end{aligned}\\right.}\n            \\newcommand{\\t}[1]{\\text{#1}}\n            \\newcommand{\\tbf}[1]{\\textbf{#1}}\n            \\newcommand{\\tit}[1]{\\textit{#1}}\n            \\newcommand{\\ttt}[1]{\\texttt{#1}}\n            \\newcommand{\\uline}[1]{\\underline{#1}}\n          \\)"
                  )
                ])
              ),
              page
            ])
          )
        ])
      )
    ])
  );
}

// build/dev/javascript/personal_site/pages/writings/cognitive_empathy_ladder.mjs
function view4() {
  return p(
    toList([
      class$("center"),
      style(toList([["text-align", "justify"]]))
    ]),
    toList([
      text(
        "I'm really grateful for where I am and the decisions and dumb luck that got me here. I'm very well-off in every regard apart from being a white noncitizen. I've spent nearly my entire life in North America, though, and in part due to wanting to feel like an American, I have little to no connection to my heritage. My perception is entirely coloured by the relatives and friends I see when returning home and my parents' history. "
      ),
      br2("0.5em"),
      text(
        "My father was remarkably unambitious, studying just enough to get to the next step (if that). He wanted to be a computer scientist, but his English mark was too low, so he settled for medicine; he wanted to be a physician but ended up settling for anaesthesiology due to competition. He made a few incredibly lucky decisions without thinking too much about it, and we somehow ended up here. This isn't just luck, obviously. He's an incredibly single-mindedly hard worker, enabled by his genuine enjoyment of his field. We got to be well-off by the time I was about 10, but before that we struggled a fair bit. (This struggling is still relative, though.)"
      ),
      br2("0.5em"),
      text(
        "From what he says, his work ethic was forged by the fierce environment of India, where this is the norm. Intense capitalism and population density mean that you need to do so much more to stand out. Part of what this entails is being cutthroat with others. The people able to leave India, especially to the U.S., are the most affluent to begin with. Sure, that doesn't necessarily translate to comparable proportional wealth, but wealth and conservatism evidently correlate: those with wealth are wont to hoard it. This, in tandem with the ruthless competition of the visa process itself means that first-generation Indian immigrants are generally very, very conservative. Under capitalism, cognitive empathy is a boon while emotional empathy is a liability. Knowing there are countless others with the same goal of emigrating, naturalized first-generation immigrants want to keep others out. They don't dislike the system, they just have a delusion of their place in it. They then proceed to act surprised when it turns out that the fascist nationalists also happen to be racists. "
      ),
      br2("0.5em"),
      text(
        "Speaking anectotally, the of the naturalized Indian immigrants I know voted for Trump, which is especially disheartening living in a swing state. This isn't a phenomenon at all unique to Indians, of course; most of the naturalized immigrants I know in general voted for Trump. By the time you realize you're not part of the in-group, it's already too late. This applied even to American-born whites that pretend they aren't just a number to someone higher up. "
      ),
      br2("0.5em"),
      text(
        "On a perhaps more individual scale, class also has a clear impact on one's relation to wealth. While it's true that "
      ),
      href_text(
        "https://www.stlouisfed.org/publications/page-one-economics/2017/01/03/education-income-and-wealth",
        "wealth and education correlate"
      ),
      text(", as do "),
      href_text(
        "https://www.pewresearch.org/politics/2024/04/09/partisanship-by-race-ethnicity-and-education/",
        "education and progressiveness"
      ),
      text(
        ", the composed correlation manifests in detached if perhaps well-meaning ways. (Performative progressivism is certainly a far better outcome than explicit evil, so long as it begets non-performative change.) Within a certain window of the upper-middle class that I've spent a fair amount of time around, though, money becomes an afterthought. Especially coming from somewhat humbler origins, the option to not have to think so much about money is itself the luxury. The mega-rich are of course driven by pure greed and seek infinite growth, but the upper-middle class ends up finding apathy not through nihilism but rather through complacency."
      ),
      br2("0.5em"),
      text(
        "I'm used to being stingy while still being wont to please others, which isn't a great combination, since it amounts to overstepping my own boundaries and then being sad about it later \u222A\uFF65\u03C9\uFF65\u222A. I do still generally expect people to compensate me in some way at some point, usually through treating me to something at another time, but I'm not frugal to the point of keeping a balance. I don't really think this is a "
      ),
      i2("good "),
      text(
        "habit, but it's somewhat okay for the time being, since the things I interact with on a regular basis are relatively inconsequential. I don't know whether I think about money more or less than I should, but I don't enjoy it either way, neither do most people apart from psychopaths, bargain-hunters, and numismatists. "
      ),
      br2("0.5em"),
      text(
        "It is always a bit sobering (mayhap even sonderous) to see someone in a vastly different class than you're used to interacting with; the human capacity for annoyance and complacency is seemingly tied very closely with how well one's immediate needs are met. I don't think there's a sweet spot per se, but I think that the fact that this is something anyone has to think about in the first place is stupid when we have enough resources for a global baseline far higher than it is now. The lack of such a baseline is perhaps what motivates the stark performative differences in wealth I've seen some of, from lower-middle- anxious conformity to upper-middle- progressivism to upper-class conservatism. Those that ascend the ladder in particular are very prone to wanting to pull it up behind them, since emotional empathy is something only afforded by those rich enough to have their needs met without being so rich that their self-worth comes from a number more valuable to them than life itself. "
      ),
      br2("0.5em"),
      text(
        "Sympathy is further obfuscated by the sheer abstraction of human lives in a global economy built on exploitation. In such an interconnected web, it's a given that any good or service involved significant harm to a living thing somewhere along its path to you, be it directly, indirectly, or even yet unrealized but inevitable (i.e., carbon footprint). This pincer of nihilism and obfuscation makes it so that whether or not you want to care, you won't soon enough. After all, heightened emotions with no viable action are rather exhausting, especially in a system that constantly reminds you quantifiably of how little influence you have relative to the richest men in the world."
      ),
      br2("0.5em"),
      text(
        "There's still a line between ignorance and nihilism, though. For a while, I was ignorant enough for the former, but enough prodding led me inevitably to intense loathing of the status quo: I've been left in a state of annoyance that I have no meaningful way of expressing productively (without risk of being deported, I suppose). (I'm assuming that the government doesn't care enough to read this in the month I have left in the country since it isn't on any social media platform, but God knows there's no telling what they'll do.) Divorcing oneself from the big picture is perhaps the objectively best route in a vulnerable position, but I don't want to lose my emotional empathy\u2014I don't want to let it simmer long enough that it goes flat and dies down by the time I'm in a position to actually do anything even as insignificant as voting. I think that forcing myself to disengage leads me nowhere quickly, though, maybe because I have very little ambition for my own personal life (outside of living somewhere with good transit \uA4B0\u0E51\u2022\u0325\uFE4F\u2022\u0325\u0E51\uA4B1) but quite a lot of passion for the big picture (such as the proliferation of transit ( \u035C\u3002 \u0361\u0296 \u035C\u3002)). Instead, I meaninglessly synthesize the terrible, nebulous now into coherent information for my future decisions. The one thing that does significantly affect me is immigration policy and racism, so I have a bonus incentive now too!"
      )
    ])
  );
}
function meta2(acc) {
  return prepend(
    [
      "cognitive_empathy_ladder",
      "Cognitive Empathy and the Ladder",
      text("Cognitive Empathy and the Ladder"),
      view4,
      "2025-04-04"
    ],
    acc
  );
}

// build/dev/javascript/personal_site/pages/writings/on_epistemology.mjs
function view5() {
  return p(
    toList([
      class$("center"),
      style(toList([["text-align", "justify"]]))
    ]),
    toList([
      text(
        "A statement within a given model can be evaluated as true, false, unprovable, undisprovable, or independent (e.g. the "
      ),
      href_text(
        "https://plato.stanford.edu/entries/continuum-hypothesis/",
        "Continuum Hypothesis"
      ),
      text(
        "), but these proofs are often incredibly tedious from the axioms. In the language \\(\\L\\) of predicate logic, strings are comprised of "
      ),
      ul(
        toList([
          style(
            toList([
              ["list-style", "circle"],
              ["list-style-position", "outside"],
              ["margin-left", "1em"]
            ])
          )
        ]),
        toList([
          li(
            toList([]),
            toList([
              text(
                "connectives \\(\\lnot\\), \\(\\land\\), \\(\\lor\\), \\(\\smp\\), and \\(\\sff\\);"
              )
            ])
          ),
          li(
            toList([]),
            toList([
              text(
                "free variable symbols \\(u\\), \\(v\\), \\(w\\), \\(u_1\\),\u2026;"
              )
            ])
          ),
          li(
            toList([]),
            toList([
              text(
                "bound variable symbols \\(x\\), \\(y\\), \\(z\\), \\(x_1\\),\u2026;"
              )
            ])
          ),
          li(
            toList([]),
            toList([
              text("quantifiers \\(\\forall\\) and \\(\\exists\\);")
            ])
          ),
          li(
            toList([]),
            toList([
              text("punctuation symbols "),
              q(toList([]), toList([text("(")])),
              text(", "),
              q(toList([]), toList([text(")")])),
              text(", and "),
              q(toList([]), toList([text(",")])),
              text(";")
            ])
          ),
          li(
            toList([]),
            toList([
              text(
                "constant symbols \\(a\\), \\(b\\), \\(c\\), \\(a_1\\),\u2026;"
              )
            ])
          ),
          li(
            toList([]),
            toList([
              text(
                "relation symbols \\(F\\), \\(G\\), \\(H\\), \\(P\\), \\(F_1\\),\u2026;"
              )
            ])
          ),
          li(
            toList([]),
            toList([
              text(
                "function symbols \\(f\\), \\(g\\), \\(h\\), \\(f_1\\),\u2026; and"
              )
            ])
          ),
          li(
            toList([]),
            toList([
              text(
                "an (optional) equality binary relation \\(\\approx\\)."
              )
            ])
          )
        ])
      ),
      text("The syntax of \\(\\L\\) is given as follows:"),
      div(
        toList([class$("equation")]),
        toList([
          text(
            "\\[\\begin{align*}\n          \\evit{BinCon} &::= {\\land} \\mid {\\lor} \\mid {\\smp} \\mid {\\sff} \\\\\n          \\evit{FreeVar} &::= u \\mid v \\mid w \\mid u_1 \\mid \\cdots \\\\\n          \\evit{BoundVar} &::= x \\mid y \\mid z \\mid x_1 \\mid \\cdots \\\\\n          \\evit{Quant} &::= {\\forall} \\mid {\\exists} \\\\\n          \\evit{Const} &::= a \\mid b \\mid c \\mid a_1 \\mid \\cdots \\\\\n          \\evit{Rel} &::= F \\mid G \\mid H \\mid P \\mid F_1 \\mid \\cdots \\\\\n          \\evit{Func} &::= f \\mid g \\mid h \\mid f_1 \\mid \\cdots \\\\\n          \\evit{Term} &::= \\evit{Const} \\mid \\evit{FreeVar} \\mid \\evit{Func}(\\evit{Term}\\ttt{+}) \\tag{Term} \\\\\n          \\evit{Atom} &::= \\evit{Rel}(\\evit{Term}) \\mid (\\evit{Term} \\approx \\evit{Term}) \\tag{Atom} \\\\\n          \\evit{Form} &::= \\evit{Atom} \\mid (\\lnot \\evit{Atom}) \\mid (\\evit{Atom} \\evit{BinCon} \\evit{Atom}) \\tag{Formula} \\\\\n            &\\qquad\\mid \\evit{Quant}\\evit{BoundVar}\\evit{Form}\n        \\end{align*}\\]"
          )
        ])
      ),
      text(
        "This allows formulas to be made but does not give them any meaning, as no valuation has been defined. Even without evaluation, though, the validity of statements should be justifiable from rules of the system alone; \\(a \\sff a\\) should always evaluate to true, for example. With this as motivation, rules of formal deduction can be defined. To this end, let \\(\\Sigma\\) denote a set of formulas."
      ),
      div(
        toList([
          class$("border"),
          style(
            toList([
              ["padding", "1em"],
              ["margin-top", "0.5em"],
              ["margin-bottom", "0.5em"]
            ])
          )
        ]),
        toList([
          text("A formula should trivially prove itself:"),
          equation(
            "\n              \\[\\begin{prooftree}\n                \\AXC{}\n                \\LeftLabel{Reflexivity} \\RightLabel{ (Ref)} \\UIC{\\(A \\vdash A\\)}\n              \\end{prooftree}\\]\n          "
          ),
          text(
            "Adding premises to an argument should not affect its conclusion:"
          ),
          equation(
            "\n            \\[\\begin{prooftree}\n                \\AXC{\\(\\Sigma \\vdash A\\)}\n                \\LeftLabel{Addition of premises} \\RightLabel{ (+)} \\UIC{\\(\\Sigma \\cup \\Sigma' \\vdash A\\)}\n            \\end{prooftree}\\]\n          "
          ),
          text(
            "If a set of premises along with the negation of an additional formula \\(A\\) is able to prove another formula \\(B\\) along with its negation, then the premises are inconsistent with \\(\\lnot A\\), so the premises must prove \\(A\\):"
          ),
          equation(
            "\n            \\[\\begin{prooftree}\n              \\AXC{\\(\\Sigma \\cup \\qty{\\lnot A} \\vdash B\\)} \\AXC{\\(\\Sigma \\cup \\qty{\\lnot A} \\vdash \\lnot B\\)} \\\n              \\LeftLabel{\\(\\lnot\\) elimination} \\RightLabel{ \\(({\\lnot}{-})\\)} \\BIC{\\(\\Sigma \\vdash A\\)}\n            \\end{prooftree}\\]\n          "
          ),
          text(
            "If a set of premises proves that \\(A\\) implies \\(B\\) as well as \\(A\\) itself, then it must also prove \\(B\\):"
          ),
          equation(
            "\n            \\[\\begin{prooftree}\n              \\AXC{\\(\\Sigma \\vdash A \\smp B\\)} \\AXC{\\(\\Sigma \\vdash A\\)} \\\\\n              \\LeftLabel{\\(\\smp\\) elimination} \\RightLabel{ \\(({\\smp}{-})\\)} \\BIC{\\(\\Sigma \\vdash B\\)}\n            \\end{prooftree}\\]\n          "
          ),
          text(
            "Similarly, if a set of premises proves a statement \\(B\\), then removing some element \\(A\\) from the premises should yield a new set proving that \\(A \\smp B\\):"
          ),
          equation(
            "\n            \\[\\begin{prooftree}\n              \\AXC{\\(\\Sigma \\cup \\qty{A} \\smp B\\)} \\\\\n              \\LeftLabel{\\(\\smp\\) introduction} \\RightLabel{ \\(({\\smp}{+})\\)} \\UIC{\\(\\Sigma \\vdash A \\smp B\\)}\n            \\end{prooftree}\\]\n          "
          ),
          text(
            "Proving the validity of multiple statements should prove each individually:"
          ),
          equation(
            "\n          \\[\\begin{prooftree}\n            \\AXC{\\(\\Sigma \\vdash A \\land B\\)} \\\\\n            \\LeftLabel{\\(\\land\\) elimination} \\RightLabel{ \\(({\\land}{-})\\)} \\UIC{\\(\\Sigma \\vdash A \\qquad \\Sigma \\vdash B\\)}\n          \\end{prooftree}\\]\n          "
          ),
          text("The converse should also hold:"),
          equation(
            "\n            \\[\\begin{prooftree}\n              \\AXC{\\(\\Sigma \\vdash A\\)} \\AXC{\\(\\Sigma \\vdash B\\)} \\\\\n              \\LeftLabel{\\(\\land\\) introduction} \\RightLabel{ \\(({\\land}{+})\\)} \\BIC{\\(\\Sigma \\vdash A \\land B\\)}\n            \\end{prooftree}\\]\n          "
          ),
          text(
            "\n            If adding either \\(A\\) or \\(B\\) as a premise suffices, then adding \\(A \\lor B\\) should as well:\n          "
          ),
          equation(
            "\n            \\[\\begin{prooftree}\n              \\AXC{\\(\\Sigma \\cup \\qty{A} \\vdash C\\)} \\AXC{\\(\\Sigma \\cup \\qty{B} \\vdash C\\)} \\\\\n              \\LeftLabel{\\(\\lor\\) elimination} \\RightLabel{ \\(({\\lor}{-})\\)} \\BIC{\\(\\Sigma \\cup \\qty{A \\lor B} \\vdash C\\)}\n            \\end{prooftree}\\]\n          "
          ),
          text(
            "Proving \\(A\\) should also prove \\(A \\lor B\\), and \\(\\lor\\) should be commutative:"
          ),
          equation(
            "\n            \\[\\begin{prooftree}\n                \\AXC{\\(\\Sigma \\vdash A\\)}\n                \\LeftLabel{\\(\\lor\\) introduction} \\RightLabel{ \\(({\\lor}{+})\\)} \\UIC{\\(\\Sigma \\vdash A \\lor B \\qquad \\Sigma \\vdash B \\lor B\\)}\n            \\end{prooftree}\\]\n          "
          ),
          text(
            "\n            A proof of \\(A \\sff B\\) should prove \\(A\\) if and only if it proves \\(B\\):\n          "
          ),
          equation(
            "\n            \\[\n              \\begin{prooftree}\n                \\AXC{\\(\\Sigma \\vdash A \\sff B\\)} \\AXC{\\(\\Sigma \\vdash A\\)} \\\n                \\LeftLabel{\\(\\sff\\) elimination} \\BIC{\\(\\Sigma \\vdash B\\)}\n              \\end{prooftree} \\quad \\begin{prooftree}\n                \\AXC{\\(\\Sigma \\vdash A \\sff B\\)} \\AXC{\\(\\Sigma \\vdash B\\)} \\\n                \\RightLabel{ \\(({\\sff}{-})\\)} \\BIC{\\(\\Sigma \\vdash A\\)}\n              \\end{prooftree}\n            \\]\n          "
          ),
          text("If adding \\(A\\) as a premise proves \\(B\\) and"),
          i2("vice versa, "),
          text("the premises prove \\(A \\sff B\\):"),
          equation(
            "\n            \\[\\begin{prooftree}\n                \\AXC{\\(\\Sigma \\cup \\qty{A} \\vdash B\\)} \\AXC{\\(\\Sigma \\cup \\qty{B} \\vdash A\\)}\n                \\LeftLabel{\\(\\sff\\) introduction} \\RightLabel{ \\(({\\sff}{+})\\)} \\BIC{\\(\\Sigma \\vdash A \\sff B\\)}\n            \\end{prooftree}\\]\n          "
          )
        ])
      ),
      text(
        "From these, new rules can be derived. For example, a set of premises should prove all of its elements:"
      ),
      equation(
        "\n        \\[\\begin{prooftree}\n           \\AXC{\\(A \\in \\Sigma\\)} \\UIC{\\(\\Sigma \\cup \\qty{A} = \\Sigma\\)}\n           \\AXC{(Ref)} \\UIC{\\(A \\vdash A\\)} \\AXC{(+)}\n           \\BIC{\\(\\Sigma \\cup \\qty{A} \\vdash A\\)}\n          \\LeftLabel{Membership rule } \\RightLabel{ \\((\\in)\\)} \\BIC{\\(\\Sigma \\vdash A\\)}\n        \\end{prooftree}\\]\n      "
      ),
      text(
        "\n        Proofs quickly grow tediously long, though; consider a proof that \\(\\qty{A \\sff B} \\vdash (A \\smp B) \\land (B \\smp A)\\):"
      ),
      equation(
        "\n        \\[\\begin{alignat}{3}\n          (1) &&\\qquad \\qty{A \\sff B, A} &\\vdash A \\sff B \\qquad&& (\\in) \\\\\n          (2) &&\\qquad &\\vdash A \\qquad&&(\\in) \\\\\n          (3) &&\\qquad &\\vdash B \\qquad&& (1), (2), ({\\sff}{-}) \\\\\n          (4) &&\\qquad \\qty{A \\sff B} &\\vdash A \\smp B \\qquad&& (3), ({\\smp}{+}) \\\\\n          (5) &&\\qquad \\qty{A \\sff B, B} &\\vdash A \\sff B \\qquad&& (\\in) \\\\\n          (6) &&\\qquad &\\vdash B \\qquad&&(\\in) \\\\\n          (7) &&\\qquad &\\vdash A \\qquad&& (5), (6), ({\\sff}{-}) \\\\\n          (8) &&\\qquad \\qty{A \\sff B} &\\vdash A \\smp B \\qquad&& (7), ({\\smp}{+}) \\\\\n          (9) &&\\qquad \\qty{A \\sff B} &\\vdash (A \\smp B) \\land (B \\smp A) \\qquad&& (4), (8), ({\\land}{+})\n        \\end{alignat}\\]\n      "
      ),
      text(
        "The rules given thus far only suffice for propositional logic, so let's add a few more!"
      ),
      div(
        toList([
          class$("border"),
          style(
            toList([
              ["padding", "1em"],
              ["margin-top", "0.5em"],
              ["margin-bottom", "0.5em"]
            ])
          )
        ]),
        toList([
          text(
            "Proving that something holds for all \\(x\\) proves that it holds for any arbitrary term \\(t\\) "
          ),
          i2("a fortiori: "),
          equation(
            "\n            \\[\\begin{prooftree}\n              \\AXC{\\(\\Sigma \\vdash \\forall x A(x)\\)}\n              \\LeftLabel{\\(\\forall\\) elimination} \\RightLabel{ \\(({\\forall}{-}\\))} \\UIC{\\(\\Sigma \\vdash A(t)\\)}\n            \\end{prooftree}\\]\n          "
          ),
          text(
            "Conversely, proving that something holds for some \\(u\\) that has no assumptions imposed upon it proves that it holds for all \\(x\\):"
          ),
          equation(
            "\n            \\[\\begin{prooftree}\n              \\AXC{\\(\\Sigma \\vdash A(u)\\)} \\AXC{\\(u\\) not occurring in \\(\\Sigma\\)}\n              \\LeftLabel{\\(\\forall\\) introduction} \\RightLabel{ \\(({\\forall}{+})\\)} \\BIC{\\(\\Sigma \\vdash \\forall x A(x)\\)}\n            \\end{prooftree}\\]\n          "
          ),
          text(
            "When \\(u\\) is completely arbitrary, then assuming \\(A(u)\\) is the same as assuming that \\(A(x)\\) holds for some \\(x\\):"
          ),
          equation(
            "\n            \\[\\begin{prooftree}\n              \\AXC{\\(\\Sigma \\cup \\qty{A(u)} \\vdash B\\)} \\AXC{\\(u\\) not occurring in \\(\\Sigma\\) or \\(B\\)}\n              \\LeftLabel{\\(\\exists\\) elimination} \\RightLabel{ \\(({\\exists}{-}\\))} \\BIC{\\(\\Sigma \\cup \\qty{\\exists x A(x)} \\vdash B\\)}\n            \\end{prooftree}\\]\n          "
          ),
          text("Proving that a statement holds for any \\(t\\) proves"),
          i2("a fortiori "),
          text("that it holds for some \\(x\\):"),
          equation(
            "\n            \\[\\begin{prooftree}\n              \\AXC{\\(\\Sigma \\vdash A(t)\\)}\n              \\LeftLabel{\\(\\exists\\) introduction} \\RightLabel{ \\(({\\exists}{+})\\)} \\UIC{\\(\\Sigma \\vdash \\exists x A(x)\\)}\n            \\end{prooftree}\\]\n          "
          ),
          text(
            "If \\(t_1 \\approx t_2\\), then \\(A(t_1)\\) implies \\(A(t_2)\\) (where not all occurrences of \\(t_1\\) need be replaced):"
          ),
          equation(
            "\n            \\[\\begin{prooftree}\n              \\AXC{\\(\\Sigma \\vdash A(t)\\)} \\AXC{\\(t_1 \\approx t_2\\)}\n              \\LeftLabel{\\(\\approx\\) elimination} \\RightLabel{ \\(({\\approx}{-})\\)} \\BIC{\\(\\Sigma \\vdash A(t_2)\\)}\n            \\end{prooftree}\\]\n          "
          ),
          text("Equivalence is reflexive:"),
          equation(
            "\n            \\[\\begin{prooftree}\n              \\AXC{}\n              \\LeftLabel{\\(\\approx\\) introduction} \\RightLabel{ \\(({\\approx}{+})\\)} \\UIC{\\(\\varnothing \\vdash u \\approx u\\)}\n            \\end{prooftree}\\]\n          "
          )
        ])
      ),
      text(
        "This is now exactly sufficient for describing first-order logic semantically through a single (meta-)relation! (There are simpler ways to do this, like "
      ),
      href_text(
        "https://en.wikipedia.org/wiki/Resolution_(logic)",
        "Resolution"
      ),
      text(
        ", but it is not immediately evident how they imply the individual semantics of each syntactical element, at least for the purposes of introducing formal deduction.) Now we can prove more statements:"
      ),
      equation(
        "\n        \\[\\begin{alignat}{3}\n          && \\Sigma &= \\qty{\\forall x(A(x) \\smp C(x)), \\forall x(B(x) \\smp D(x))} \\\\\n          (1) &&\\qquad \\Sigma \\cup \\qty{A(t)} &\\vdash A(t) \\qquad&& (\\in) \\\\\n          (2) && &\\vdash \\forall x(A(x) \\smp C(x)) \\qquad&& (\\in) \\\\\n          (3) && &\\vdash A(t) \\smp C(t) \\qquad&& (2), ({\\forall}{-}) \\\\\n          (4) && &\\vdash C(t) \\qquad&& (1), (3), ({\\smp}{-}) \\\\\n          (5) && &\\vdash C(t) \\lor D(t) \\qquad&& (4), ({\\lor}{+}) \\\\\n          (6) && &\\vdash \\exists x(C(x) \\lor D(x)) \\quad&& (5), ({\\exists}{+}) \\\\\n          (7) &&\\qquad \\Sigma \\cup \\qty{B(t)} &\\vdash B(t) \\qquad&& (\\in) \\\\\n          (8) && &\\vdash \\forall x(B(x) \\smp D(x)) \\qquad&& (\\in) \\\\\n          (9) && &\\vdash A(t) \\smp D(t) \\qquad&& (8), ({\\forall}{-}) \\\\\n          (10) && &\\vdash C(t) \\qquad&& (7), (9), ({\\smp}{-}) \\\\\n          (11) && &\\vdash C(t) \\lor D(t) \\qquad&& (10), ({\\lor}{+}) \\\\\n          (12) && &\\vdash \\exists x(C(x) \\lor D(x)) \\quad&& (11), ({\\exists}{+}) \\\\\n          (13) &&\\qquad \\Sigma \\cup \\qty{A(t) \\lor B(t)} &\\vdash \\exists x(C(x) \\lor D(x)) \\qquad&& (6), (12), ({\\lor}{-}) \\\\\n          (14) &&\\qquad \\Sigma \\cup \\qty{\\exists x(A(x) \\lor B(x))} &\\vdash \\exists x(C(x) \\lor D(x)) \\quad&& (13), ({\\exists}-) \\\\\n          (15) &&\\qquad \\Sigma &\\vdash \\exists x(A(x) \\lor B(x)) \\smp \\exists x(C(x) \\lor D(x)) \\quad&& (14), ({\\smp}{+})\n        \\end{alignat}\\]\n      "
      ),
      text(
        "No way, adding more rules made the system more complicated \u222A\uFF65\u03C9\uFF65\u222A. In exchange, though, we gain the full expressive power of first-order logic! With this, set theory can be formally abstracted into the rest of mathematics."
      ),
      hr2(),
      text(
        "In my eyes, much of the joy of mathematics comes from this underlying formal system that can generally be taken for granted. Abstracting so far above logic counterintuitively makes the immediate emergent properties extremely relevant, as they butterfly into more useful specific cases depending on the field of discourse and the degree of abstraction. Of course, my only exposure to logic is through computer science rather than philosophy or math, and model theory and category theory are a bit strange to be learning before even a formal treatment of abstract algebra, so I'll hold off a bit before expounding on this."
      ),
      br(toList([])),
      text(
        "I would, however, like to pontificate about the more pragmatic philosophy of truth. In reality, there are no underlying axioms (apart from physics, I suppose). Even then, we know only what our senses tell us. It's not meaningful to ponder the validity of one's own perception, lest we devolve into self-contained "
      ),
      href_text(
        "https://en.wikipedia.org/wiki/Boltzmann_brain",
        "Boltzmann brains"
      ),
      text(
        ", but individual perspectives are of course inherently subjective. I will never see most of the world, or interact with most of its people, or eat most of its foods, or hear most of its music. From this, I make two extrapolations: "
      ),
      ol(
        toList([
          style(
            toList([
              ["list-style", "decimal"],
              ["list-style-position", "outside"],
              ["margin-left", "1em"]
            ])
          )
        ]),
        toList([
          li(
            toList([]),
            toList([
              text(
                "Obviously, it isn't possible to know everything, nor is there a need to. It's not possible not to live in a bubble both spacial and temporal, so all I can hope to do is to see a fraction of a fraction of this small slice. It would be ridiculous to suppose that this bubble just so happens to be representative of everything else; given how miniscule the sample is, it would only make sense that any averages I observe are far from reality. "
              )
            ])
          ),
          li(
            toList([]),
            toList([
              text(
                "When faced with a reality I can't hope to understand, I have very, very little ground to stand in opposition. Without receiving communication, I have no way of knowing what's happening outside of my world, but this isn't justification for na\xEFvet\xE9. One of the wonders of Web \\(2.0\\) is that it's never been easier to hear from an incredibly diverse population. As such, it's best to place weight on firsthand information while being conscientious of the unfortunate web of ulterior motives begotten by the profit motive."
              )
            ])
          )
        ])
      ),
      text(
        "These took me far too long to come to thanks to the sophistry of pseudo-logic peddled by proponents of so-called meritocracy. For a time, I attempted to reconcile the incongruity between perspectives, but that gets increasingly difficult as the people rhetorically pushing some of those perspectives demonstrably do not have my own interest in mind. Communication is built on mutual understanding, which is diametrically opposed with a system founded on exploitation. Allowing oneself to facetiously sell an ideology has the added bonus of justifying the status quo, giving solace to many and absolving some amount of guilt from the abusers of the system."
      ),
      br2("0.5em"),
      text(
        "It's painfully easy to forget the logical foundations we take for granted. Especially easy to miss is the fact that "
      ),
      i2(
        "these foundations exist to describe existing systems, not the other way around. "
      ),
      text(
        "Applying rules where they don't belong is made simpler when you aren't exposed to a world where those rules don't arise; if all you know is \\(\\Z/2\\Z\\), the "
      ),
      href_text(
        "https://en.wikipedia.org/wiki/Freshman's_dream",
        "freshman's dream"
      ),
      text(" is trivial, after all:"),
      equation(
        "\n        \\[\\begin{align*}\n          ([a]_2 +_2 [b]_2)^2 &= \\qty[(a + b)^2]_2 = \\qty[a^2 + 2ab + b^2]_2 \\\\\n            &= \\qty[a^2]_2 +_2 [2ab]_2 +_2 \\qty[b^2]_2 = \\qty[a]_2^2 +_2 \\qty[b]_2^2\n        \\end{align*}\\]\n      "
      ),
      text(
        "Pondering the nature of truth has gotten me nowhere quickly. I had a particularly bad period when I was about 10, realizing the tautology of reality and starting to distrust it as a result. After a bit, though, I realized how useless thinking about all of this is. Math is only interesting because we acknowledge assumptions and limitations explicitly. Reality is only interesting when you acknowledge the limitations of truth."
      ),
      br2("0.5em"),
      text(
        "So what is truth, then? Truth is power\u2014it is a story to rationalize the structures we encounter in life, to influence our feelings towards them in relation to ourselves\u2014but more than that, it is a narrative. Rationality and truth are the story we tell ourselves\u2014the assumptions we hold to be self-evident. As such, these truths reflect their subscribers potentially more than their subjects. Unlike mathematical logic, reality cannot be discretized so neatly into truths and untruths, as facts are themselves opinions, implicitly contingent on the axioms. These axioms may come in the form of a social contract or simply as societal norms, but they cannot be intrinsic. A commitment to empiricism is a perspective, so what makes it better or worse than someone's independent arbitration?"
      ),
      br(toList([])),
      text(
        "A social truth can come from consensus, but this consensus is an aggregate of subjectivities that is then aggregated and finally observed subjectively once more. Through so many filters, its value becomes more dubious. I believe it is "
      ),
      i2("values "),
      text(
        "that govern our facts. Take climate change, for example: scientists make independent assessments of a situation, find that they all share a common thread, notice a correlation, are able to reason a causal relationship, and then relay that information to the others. Science definitionally values observation, which is then assessed mathematically. The reason that this is touted as truthful is that we have historically tested its results and predictions and evaluated them as a crucial system for furthering human progress. Truth is our interpretation of the world, so a value system built on evaluating that world as close to axiomatically as possible allows us to imitate reality with our own system of truths, just as with the abstraction of first-order logic. (After all, physics is just a field of mathematics, as are all other sciences o(\u2267\u2207\u2266o).)"
      ),
      br2("0.5em"),
      text(
        "In this case, the difference between reality and truth is largely a philosophical technicality. Science is our attempt to distill reality into comprehensible truth. Choosing to value the scientific method is still a value judgement, though, and one that "
      ),
      i2("cannot be taken for granted. "),
      text(
        "An issue with trying to accurately portray reality is that it captures the good and the bad, though it of course does not specify which is which. (Who's to say whether human lives or a made-up number is more valuable, after all?) The power of rhetoric comes from its ability to frame judgement and truth alike as objective and natural, or at the very least in a persuasive light."
      ),
      br(toList([])),
      text(
        "It seems natural to always want the truth to align with reality as closely as possible, but when reality is disadvantageous to a cause, it is always excluded from the truth, be it ex- or implicitly. The Enlightenment was characterized by a rejection of blind truth in pursuit of representing reality as it is, rather than falling back on societal truths. This cultural shift required a change in the dissemination of information from authority; it was no longer enough to simply cite God. When ethos is no longer sufficient, it's time for pathos and logos. Moralistic nationalism under the guise of objectivity has become the hallmark of fascist movements for the past several centuries, which show no signs of slowing. On the other hand, science remains a tool for manipulating public interest. With the sudden relevance of STEM in the past century and the sheer abstraction inherent to the modern sciences, it's easier than ever to peddle lies posing as skepticism or rationality. Technology has been characterized by speculative bubbles built on such false promises, from dot-com to Web 2.0 to the App Store to Web 3.0 to AI to quantum computing. Perhaps an even better example is the growing anti-intellectual movement headed by "
      ),
      i2("certain "),
      text(" sociopolitical groups. (I wonder why\u2026)"),
      br(toList([])),
      text(
        "Meta-studies are how consensus is formally assessed, but they are colloquially irrelevant. People are often very passionate yet hardly invested in issues close to their identity, lest they be challenged. So when a large group of people distrusts another group of people, it's not terribly difficult to play into that distrust to peddle snake oil. When truth is part of your identity, you eschew any hope of self-criticality, becoming a mere tool for someone else's prerogative. The scientific process of revision is what enables progress, not a dogmatic fixation on truth. "
      )
    ])
  );
}
function meta3(acc) {
  return prepend(
    [
      "on_epistemology",
      "On Epistemology",
      text("On Epistemology"),
      view5,
      "2025-03-26"
    ],
    acc
  );
}

// build/dev/javascript/personal_site/pages/writings/small_phone.mjs
function view6() {
  return p(
    toList([
      class$("center"),
      style(toList([["text-align", "justify"]]))
    ]),
    toList([
      text(
        "The Pebble watch has always been really interesting to me. I don't want very much from a smartwatch, and an e-paper display seemed perfect, as did the customizability. Unfortunately, Pebble was eaten by Fitbit, which was in turn absorbed by Google, where technologies go to die. After much harassment, the valiant "
      ),
      href_text("https://ericmigi.com/", "Eric Migicovsky"),
      text(
        " got Google to open-source the unused technology, renewing hope for the enthusiast fans that have been holding on for 8 long years through continued support and a "
      ),
      href_text("https://repebble.com/", "revival"),
      text(
        ". Of course, Apple being Apple has fortified their walled garden to severely limit any non-Apple Watch smartwatches (though luckily "
      ),
      href_text(
        "https://www.theverge.com/news/632718/europe-digital-markets-act-apple-interoperability-smartwatches",
        "the EU is finally getting on that"
      ),
      text(")."),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "Seeing Apple's malevolence for the umpteenth time, I reflected again on why I switched back to iOS to begin with. I don't think I had much of a reason apart from wanting to see what iOS was like on a phone after so long (and the fact that my Android broke ( \u0361\xB0 \u0296\u032F \u0361\xB0)). I miss being excited by hardware technology, growing up with the rapid improvement of the first half of the 2010s. It seems like very little has changed in the world of consumer technology since around 2017. Sure, things get faster, but to what end? I think the layman was satisfied long ago, and even I've been disinterested for a while apart from foldables and Apple silicon. "
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "I hate that companies chase market trends and profitability above all else. The "
      ),
      href_text(
        "https://www.youtube.com/watch?v=FJgTKx-rg18",
        "enthusiast trap"
      ),
      text(
        " saddens me to no end, luring in consumers in a simple bid for market share before being able to pivot into a more competitive but larger category. A niche that is apparently not popular enough is that of the one-handable device, considering Apple and Asus' discontinuation of their (relatively) compact lines in 2022 and 2024 respectively. Seeing this, our aforementioned hero made a "
      ),
      href_text("https://smallandroidphone.com/", "petition"),
      text(
        " to tell manufacturers not to disregard us, but alas, this has borne no fruit thus far. "
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "To me, this is a microcosm of the tyranny of the majority inherent to capitalism. Demand does not mean demand, as it measures not only how large a group wants something but also how much they are willing to pay for it, and how often. Anecdotally speaking, people with small phones tend not to upgrade very often (though this may just be a byproduct of how slim their options are), and since the screen size is smaller, a compactified sku is typically sold at a lower price and with smaller margins (even if only marginally so). So when the majority are satisfied with something that everyone needs, what's the issue with forcing the minority to conform? After all, what else can they do?"
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        "Another confounding factor is, of course, government interest. While this doesn't much apply here, I'm also passionate about transit: I despise the "
      ),
      href_text(
        "https://medium.com/radical-urbanist/cars-gets-billions-in-hidden-subsidies-b3bf9e6bfafc",
        "subsidies"
      ),
      text(" and "),
      href_text(
        "https://home.treasury.gov/data/troubled-assets-relief-program/automotive-programs/overview",
        "bailouts"
      ),
      text(" and "),
      href_text(
        "https://www.urban.org/policy-centers/cross-center-initiatives/state-and-local-finance-initiative/state-and-local-backgrounders/highway-and-road-expenditures",
        "public works"
      ),
      text(
        " that all contribute to terrible infrastructure that harms communities and the world as a whole while creating a privatized, exorbitantly expensive commodity that's for all intents and purposes required to function within society. What's even more infuriating is the fact that North America was "
      ),
      i(toList([]), toList([text("built ")])),
      text(
        "along railroads that the government chose to rip out, along with other forms of transit, just to artificially spur an enormous industry that they could proceed to propagandize until it sickeningly became a point of "
      ),
      i(toList([]), toList([text("pride.")])),
      text(
        " The closest historical analog I can think of is the Opium Wars, but this was done "
      ),
      i(
        toList([]),
        toList([text("domestically for profit and control")])
      ),
      text(" and got the targets hooked to the point that "),
      i(toList([]), toList([text("they don't even notice")])),
      text(" and now serve as agents of the status quo."),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text("While small phones perhaps wouldn't "),
      href_text(
        "https://www.motortrend.com/features/why-americas-roads-keep-getting-deadlier-safety-research/",
        "save as many lives as small cars"
      ),
      text(
        ", both are much-needed remedies for industries that are so far removed from providing any actual utility to consumers that they now actively harm lives while charging a premium to both individuals and society; a common argument in favour of smaller phones is that they reduce screentime, which I believe is unilaterally good (at least holistically). (I don't need to make the comparison between smartphones and opium myself, do I?)"
      ),
      br(toList([style(toList([["margin-bottom", "0.5em"]]))])),
      text(
        `On a hopeful (perhaps delusionally so) note, Nothing's expected CMF Phone 2 recently leaked, and sources are saying (with no actual evidence apart from dubious eyeballing) that it has a \\(5.2\\)\u2013\\(5.5\\)" display, placing it firmly in iPhone mini territory. Even in this cruel, cruel world, there is hope after all! (At least until this is deconfirmed.)`
      )
    ])
  );
}
function meta4(acc) {
  return prepend(
    [
      "small_phone",
      "Small phone big transit where ( \u2022\u032F\u0301 ^ \u2022\u032F\u0300)",
      text("Small phone big transit where ( \u2022\u032F\u0301 ^ \u2022\u032F\u0300)"),
      view6,
      "2025-03-19"
    ],
    acc
  );
}

// build/dev/javascript/personal_site/pages/writings/tuples.mjs
function view7() {
  return div(
    toList([]),
    toList([
      p(
        toList([
          class$("center"),
          style(toList([["text-align", "justify"]]))
        ]),
        toList([
          text(
            "Consider the humble pair, \\((x, y)\\). It's not exactly groundbreaking, but it's not immediately trivial from the ZF axioms either, since a set \\(\\{x, y\\}\\) is inherently unordered. The traditional definition of a pair is\n          \\[(x, y) \\treq \\qty{\\qty{x}, \\qty{\\qty{x, y}}}\\]\n      Ah, so a tuple is just a set ordered by inclusion, how simple! Surely, then,\n        \\[(x_i)_{i = 1}^n = \\left\\{\\{x_i\\}_{i = 1}^j\\right\\}_{j = 1}^n\\]\n      This is what I genuinely believed for an embarrassingly long time, but the trouble with this is that an ordered set is "
          ),
          i(toList([]), toList([text("itself ")])),
          text(
            "a pair of a set and a relation, and a relation is also just a set of pairs. We just got past Russell's paradox, so we can't exactly afford any more self-reference. (I know this can be defined as a separate isomorphic entity; that's kind of the point of this, as you'll soon find out.) Tuples are instead recursively defined with nesting (in a manner resembling lists in the \\(\\lambda\\)-calculus):"
          ),
          equation(
            "\n          \\[\\begin{align*}\n            (x, y, z) &\\treq \\bigl(x, (y, z)\\bigr) \\\\\n              &= \\qty{\\qty{x}, \\qty{x, (y, z)}} \\\\\n              &= \\qty{\\qty{x}, \\qty{x, \\qty{\\qty{y}, \\qty{y, z}}}}\n          \\end{align*}\\]\n        "
          ),
          text(
            "\n          Okay, this isn't the prettiest thing in the world, but it certainly does work. It also implies that Cartesian exponentiation is right-associative, which is interesting. Speaking of which, Cartesian and set exponentiation differ. To see this, let us first review the set-theoretic notions of relations and functions."
          ),
          br(
            toList([style(toList([["margin-bottom", "0.5em"]]))])
          ),
          text("A "),
          b(toList([]), toList([text("relation ")])),
          text("with domain \\(X\\) and codomain \\(Y\\) is some"),
          equation(
            "\n          \\[R \\sube X \\times Y \\treq \\qty{(x, y) \\mid x \\in X, y \\in Y}\\]\n        "
          ),
          text(
            "\n          \\(x \\in X\\) is related \\(y \\in Y\\) by \\(R\\) when \\((x, y) \\in R\\). A,\n        "
          ),
          b(toList([]), toList([text(" function ")])),
          text(
            "is simply a relation such that each \\(x \\in X\\) is related to exactly one \\(y \\in Y\\) (passing the vertical-line test, so to speak). A\n       "
          ),
          b(toList([]), toList([text("choice function ")])),
          text(
            "on an indexed family of sets \\(\\qty{X_y}_{y \\in Y}\\) is a function \\(f: Y \\to \\bigcup_{y \\in Y} X_y\\) such that each \\(y \\in Y\\) maps to an element of \\(X_y\\); that is, a choice function is a way to "
          ),
          i(toList([]), toList([text("choose ")])),
          text("an element from a given index. The "),
          b(toList([]), toList([text("product ")])),
          text(
            "over the collection is the set of all such choice functions. When each \\(X_y\\) is the same, this can be regarded as the \\(Y\\)-fold product of \\(X\\), or \\(X^Y\\). This is a simply collection of functions \\(f: Y \\to X\\) such that for each \\(y \\in Y\\), \\(f(y) \\in X\\), which happens to characterize all functions \\(f: Y \\to X\\). A crucial consideration to make is that natural numbers are themselves sets (as Von Neumann ordinals), defined recursively with \\(0 \\triangleq \\varnothing\\) and \\(n + 1 \\triangleq n \\cup \\qty{n}\\). In general, \\(n = \\qty{i}_{i = 0}^{n - 1}\\), so an element of \\(X^n\\) is a function that takes a natural number less than \\(n\\) and maps it to an element of \\(X\\). (This can be thought of as a 0-indexed list.) Expanding definitions, this yields"
          ),
          equation(
            "\n          \\[X^2 = \\qty{f \\in \\mathcal{P}(2 \\times X) \\mid \\forall n \\in 2, \\exists! x \\in X, (n, x) \\in f}\\]\n        "
          ),
          text(
            "\n          An element of \\(X^2\\) is a function \\(f: 2 \\to X\\) of the form \\(\\qty{(0, x_0), (1, x_1)}\\), which is decidedly not a pair \\((x_0, x_1)\\). This is analogous to a sequence, though. This should be clear from the definition alone, since \\(\\mathbb{N}\\) can be regarded as the limit of \\(n\\) as you keep adding 1, being the union of "
          ),
          i(toList([]), toList([text("all ")])),
          text(
            "natural numbers as opposed to just the first \\(n\\). "
          ),
          i(
            toList([]),
            toList([
              text(
                "(If only there were a convenient term for this exact thing.) "
              )
            ])
          ),
          text(
            "The definition of exponentiation as a set of finite sequences rather than tuples means that \\(X^n \\subseteq X^*\\), where \\(*\\) is the "
          ),
          b(toList([]), toList([text("Kleene star operator, ")])),
          text(
            "with \\(X^*\\) defined as the set of finite sequences (strings) with elements (characters) in \\(X\\) (the alphabet). "
          ),
          br(
            toList([style(toList([["margin-bottom", "0.5em"]]))])
          ),
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
              li(
                toList([]),
                toList([text("\\(x \\not< x\\), and")])
              ),
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
          text(
            "Pairing \\(X\\) with such an ordering \\(<\\) yields a "
          ),
          b(toList([]), toList([text("strictly ordered set ")])),
          text(
            "\\((X, {<})\\). Not only does this pair require a preexisting definition of a tuple, but so too does the relation, as established above, so while this is perhaps the most straightforward, axiomatic way to define ordering, it cannot be the most foundational one."
          ),
          br(toList([])),
          text(
            "My supposed definition of an \\(n\\)-tuple can be derived from this by letting \\({<} = {\\subseteq}\\) and denoting each set by its first element not in any smaller set (with a choice function!)."
          ),
          br(
            toList([style(toList([["margin-bottom", "0.5em"]]))])
          ),
          text(
            "It's trivial to see that all of these definitions are order-isomorphic, so this amounts to pedantry; while abuse of notation can certainly be an issue in mathematics, it's good to know when to draw the line. I'm no set theorist, so I think I'll leave it at that."
          )
        ])
      )
    ])
  );
}
function meta5(acc) {
  return prepend(
    [
      "tuples",
      "How are tuples?",
      div(
        toList([]),
        toList([
          i(toList([]), toList([text("How")])),
          text(" are tuples?")
        ])
      ),
      view7,
      "2025-03-12"
    ],
    acc
  );
}

// build/dev/javascript/personal_site/utils.ffi.mjs
var refresh = () => {
  setTimeout(() => {
    MathJax.typeset();
  }, 0);
};
var retitle = (newTitle) => {
  setTimeout(() => {
    document.title = newTitle;
  });
};

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
    retitle("R\xE9sum\xE9");
    return new OnRouteChange(new Resume2());
  } else if ($.hasLength(2) && $.head === "writings") {
    let title = $.tail.head;
    return new OnRouteChange(new Writings(title));
  } else if ($.hasLength(1) && $.head === "writings") {
    return new OnRouteChange(new Writings(""));
  } else {
    retitle("Endolite");
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
          toList([text("R\xE9sum\xE9")])
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
  let writings = (() => {
    let _pipe = toList([]);
    let _pipe$1 = meta5(_pipe);
    let _pipe$2 = meta(_pipe$1);
    let _pipe$3 = meta4(_pipe$2);
    let _pipe$4 = meta3(_pipe$3);
    return meta2(_pipe$4);
  })();
  let $ = title === "";
  if ($) {
    retitle("Writings");
    return div(
      toList([style(toList([["margin", "20px"]]))]),
      map(
        writings,
        (x) => {
          return div(
            toList([
              class$("center"),
              style(
                toList([
                  ["display", "flex"],
                  ["justify-content", "space-between"],
                  ["max-width", "400px"]
                ])
              )
            ]),
            toList([
              hoverable_text(
                a(
                  toList([href("/writings/" + x[0])]),
                  toList([x[2]])
                )
              ),
              p(toList([]), toList([text(x[4])]))
            ])
          );
        }
      )
    );
  } else {
    return div(
      toList([]),
      (() => {
        let $1 = filter(writings, (x) => {
          return x[0] === title;
        });
        if ($1.hasLength(1)) {
          let a2 = $1.head;
          retitle(a2[1]);
          return toList([
            h1(
              toList([
                style(
                  toList([["font-size", "24pt"], ["text-align", "center"]])
                )
              ]),
              toList([a2[2]])
            ),
            div(
              toList([style(toList([["text-align", "center"]]))]),
              toList([
                time(
                  toList([
                    style(toList([["font-size", "12pt"]])),
                    attribute("datetime", a2[4])
                  ]),
                  toList([text(a2[4])])
                )
              ])
            ),
            a2[3]()
          ]);
        } else {
          throw makeError(
            "panic",
            "personal_site",
            187,
            "view_writing",
            "`panic` expression evaluated.",
            {}
          );
        }
      })()
    );
  }
}
function view8(model) {
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
function main() {
  let app = application(
    init3,
    update,
    (x) => {
      let _pipe = x;
      let _pipe$1 = view8(_pipe);
      return mathjax_wrapper(_pipe$1);
    }
  );
  let $ = start2(app, "#app", void 0);
  if (!$.isOk()) {
    throw makeError(
      "let_assert",
      "personal_site",
      35,
      "main",
      "Pattern match failed, no pattern matched the value.",
      { value: $ }
    );
  }
  return $;
}

// build/.lustre/entry.mjs
main();
