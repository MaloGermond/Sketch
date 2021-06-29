/**
 *  Privowny
 *
 *  Copyright (c) Privowny 2010-2019 -- All Rights Reserved
 */


/**
 * Tell if a given value represent a variable.
 *
 * @private
 * @param {string} aFieldValue
 */
function isVariable(aFieldValue) {
  if (typeof aFieldValue === "string")
    return aFieldValue.startsWith("$");

  return false;
}

/**
 * If the value is a variable, resolve it (dereference it)
 * and return the dereferenced value.
 *
 * Otherwise return the value directly.
 *
 * @private
 * @param {Object} aRoot
 * @param {string} aValue
 * @returns {any}
 */
function resolveValue(aRoot, aValue) {
  if (!isVariable(aValue))
    return aValue;

  return resolveValue(aRoot, aValue
    .slice(1)
    .split(".")
    .reduce((acc, value) => {
      if (acc[value] === undefined) {
        throw new Error(`Invalid path: ${aValue}`);
      }
      return acc[value];
    }, aRoot));
}

/**
 * Resolve a full object, meaning:
 *  - This copy field specified in aBase object if any
 *  - This copy field from inherited object if any
 *
 * @private
 * @param {Object} aObject
 * @param {string} aBase
 * @returns {Object}
 */
function resolveObject(aRoot, aObject, aBase = null) {

  let copy = Object.assign({}, aObject);

  if (aBase) {
    const base = resolveObject(aRoot, resolveValue(aRoot, aBase));
    copy = Object.assign(copy, base);
  }

  if (aObject.__inherit__) {
    const parent = resolveObject(aRoot, resolveValue(aRoot, aObject.__inherit__));
    copy = Object.assign(copy, parent);
  }

  for (let key in aObject) {
    if (typeof aObject[key] === "string") {
      copy[key] = resolveValue(aRoot, aObject[key]);
    }
  }

  return copy;
}

/**
 * Traverse an object tree and resolve each individual level.
 *
 * @private
 * @param {Object} aRoot
 * @param {Object} aObject
 * @param {string} aBase
 * @returns {Object}
 */
function traverseAndResolve(aRoot, aObject = null, aBase = null) {

  const object = aObject ? aObject : aRoot;
  // Resolve the object
  const copy = resolveObject(aRoot, object, aBase);

  // Recursivly traverse each child object
  for (let key in object) {
    if (typeof object[key] === "object") {
      copy[key] = traverseAndResolve(aRoot, object[key], object.__base__);
    }
  }

  // Delete unusde fields
  delete copy.__base__;
  delete copy.__inherit__;

  return copy;
}

/**
 * Main entry point, traverse
 *
 * @param {Object|string} aSpec The Manifest file as string of json object
 * @returns {impor("./DesignSystem").Manifest} The fully resolve design system spec
 */
module.exports = function(aSpec) {
  let spec = aSpec;
  if (typeof aSpec === "string") {
    spec = JSON.parse(aSpec);
  }
  return traverseAndResolve(spec);
}