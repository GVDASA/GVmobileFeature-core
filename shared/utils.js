angular.module('core.utils', [])

.factory('$gvmUtil', Util);

function Util() {
	return {
		merge: Merge
	};
	//////////////////////////////////////////////////////////////////////////

	// merge to arrays by specific property value 
	// and apply a inner, left or rigth transform funcition
	function Merge(a, b, by, select, lSelect, rSelect) {
		var m = [],
			k = {},
			pos = 0,
			s = false,
			r = [],
			fn = function(i) {
				var ckey = by ? i[by] : i;
				if (k[ckey] !== undefined) {
					var iPos = k[ckey];
					delete m[iPos];
					r[iPos] = !select ? r[iPos] : select(r[iPos], i, iPos);
				} else {
					k[ckey] = pos;
					m[pos] = s ? rSelect : lSelect;
					r[pos] = i;
					pos++;
				}
			};
		a.map(fn);
		s = true;
		b.map(fn);
		return r.map(function(it, i) {
			return m[i] ? m[i](it, i) : it;
		});
	};


};