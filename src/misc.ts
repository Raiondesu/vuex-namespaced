/**
 * assignToPath (https://gist.github.com/Raiondesu/759425dede5b7ff38db51ea5a1fb8f11)
 * Assigns a value to an object by a given path (usually string).
 * If the path is invalid, silently creates the required path and assigns a value
 *
 * @param obj an object to get a value from.
 * @param path to get a value by.
 * @param value a value to assign.
 * @param splitter to split the path by. Default is '.' ('obj.path.example')
 */
export function assignToPath(obj, path, value, splitter = '.') {
  if (!path)
    return obj;

  const pathArr = (typeof path === 'string'  && ~path.indexOf(splitter)) ? path.split(splitter) : [path];
  const key = pathArr.pop()!;

  const final = pathArr.length === 0 ?
    obj : pathArr.reduce((o, i) => {
      if (o === Object(o)) {
        if (o[i] === undefined)
          o[i] = {};

        return o[i];
      }

      return o = {};
    }, obj);

  final[key] = value;
}
