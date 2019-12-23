function performParseNameTests(e) {
    function r(e, r) {
        if (e === r) return !0;
        if (!(e instanceof Object && r instanceof Object)) return !1;
        if (e.constructor !== r.constructor) return !1;
        for (var t in e)
            if (e.hasOwnProperty(t) && r.hasOwnProperty(t) && e[t] !== r[t]) {
                if ("object" != typeof e[t]) return !1;
                if (!Object.equals(e[t], r[t])) return !1
            } for (t in r)
            if (r.hasOwnProperty(t) && !e.hasOwnProperty(t)) return !1;
        return !0
    }

    function t(e) {
        return ("000" + e).slice(-4)
    }
    this.p = function (e) {
        for (var r = ["jr", "sr", "i", "ii", "iii", "iv", "v"], t = ["prof", "mr", "mrs", "ms", "dr", "miss", "sir", "madam", "hon"], i = {
                prefix: "",
                first: "",
                middle: "",
                last: "",
                suffix: ""
            }, n = [], s = 0, f = 0; f < e.length; f++)
            if (" " == e[f] || "," == e[f] || "." == e[f]) {
                var p = "," == e[f] ? f + 1 : f;
                n.push(e.substring(s, p)), s = f + 1
            } f > s && n.push(e.substring(s, f));
        for (var f = n.length - 1; f >= 0; f--) "" == n[f].replace(/,+/, "") && n.splice(f, 1);
        if (t.splice(3, 1), n.length > 0) {
            var a = n[0].toLowerCase(); - 1 != t.indexOf(a) && (i.prefix = n.shift())
        }
        if (n.length > 0) {
            var a = n[n.length - 1].toLowerCase(); - 1 != r.indexOf(a) && (i.suffix = n.pop())
        }
        if (0 == n.length) return i;
        if (1 == n.length) "" == i.prefix ? i.first = n.shift().replace(",", "") : i.last = n.shift().replace(",", "");
        else if ("," == n[0][n[0].length - 1]) {
            if (i.last = n.shift().replace(",", ""), n.length > 0) {
                var a = n[0].toLowerCase(); - 1 != t.indexOf(a) && (i.prefix = n.shift())
            }
            n.length > 0 && (i.first = n.shift().replace(",", ""));
            for (var f = 0; f < n.length; f++) i.first += " " + n[f].replace(",", "");
            i.first = i.first.trim()
        } else {
            i.first = n.shift().replace(",", ""), i.last = n.pop().replace(",", "");
            for (var f = 0; f < Math.min(1, n.length); f++) i.middle += n[f].replace(",", "") + " ";
            i.middle = i.middle.trim()
        }
        return i
    };
    for (var i = 0; i < e.length; ++i) {
        var n = e[i];
        if (n.hasOwnProperty("input") && n.hasOwnProperty("expectedOutput")) {
            var s = this.p(n.input),
                f = r(s, n.expectedOutput);
            document.write("Test " + t(i) + " &nbsp; &nbsp; ["), f ? document.write('<span style="color: aqua;">PASS</span>') : document.write('<span style="color: red;">FAIL</span>'), document.write("]"), f || (document.write(':<br /> &nbsp; &nbsp; Input:&nbsp; "' + n.input + '"'), document.write("<br /> &nbsp; &nbsp; Output: " + JSON.stringify(s).replace(/,"/g, ', "'))), document.write("<br />")
        }
    }
}
