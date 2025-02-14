!function (e) {
    var t = {};
    function n(r) {
        if (t[r])
            return t[r].exports;
        var i = t[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(i.exports, i, i.exports, n),
            i.l = !0,
            i.exports
    }
    n.m = e,
        n.c = t,
        n.d = function (e, t, r) {
            n.o(e, t) || Object.defineProperty(e, t, {
                enumerable: !0,
                get: r
            })
        }
        ,
        n.r = function (e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }),
                Object.defineProperty(e, "__esModule", {
                    value: !0
                })
        }
        ,
        n.t = function (e, t) {
            if (1 & t && (e = n(e)),
                8 & t)
                return e;
            if (4 & t && "object" == typeof e && e && e.__esModule)
                return e;
            var r = Object.create(null);
            if (n.r(r),
                Object.defineProperty(r, "default", {
                    enumerable: !0,
                    value: e
                }),
                2 & t && "string" != typeof e)
                for (var i in e)
                    n.d(r, i, function (t) {
                        return e[t]
                    }
                        .bind(null, i));
            return r
        }
        ,
        n.n = function (e) {
            var t = e && e.__esModule ? function () {
                return e.default
            }
                : function () {
                    return e
                }
                ;
            return n.d(t, "a", t),
                t
        }
        ,
        n.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
        ,
        n.p = "",
        n(n.s = 2)
}([function (e, t, n) {
    "use strict";
    var r = {
        generateIdentifier: function () {
            return Math.random().toString(36).substr(2, 10)
        }
    };
    r.localCName = r.generateIdentifier(),
        r.splitLines = function (e) {
            return e.trim().split("\n").map((function (e) {
                return e.trim()
            }
            ))
        }
        ,
        r.splitSections = function (e) {
            return e.split("\nm=").map((function (e, t) {
                return (t > 0 ? "m=" + e : e).trim() + "\r\n"
            }
            ))
        }
        ,
        r.getDescription = function (e) {
            var t = r.splitSections(e);
            return t && t[0]
        }
        ,
        r.getMediaSections = function (e) {
            var t = r.splitSections(e);
            return t.shift(),
                t
        }
        ,
        r.matchPrefix = function (e, t) {
            return r.splitLines(e).filter((function (e) {
                return 0 === e.indexOf(t)
            }
            ))
        }
        ,
        r.parseCandidate = function (e) {
            for (var t, n = {
                foundation: (t = 0 === e.indexOf("a=candidate:") ? e.substring(12).split(" ") : e.substring(10).split(" "))[0],
                component: parseInt(t[1], 10),
                protocol: t[2].toLowerCase(),
                priority: parseInt(t[3], 10),
                ip: t[4],
                address: t[4],
                port: parseInt(t[5], 10),
                type: t[7]
            }, r = 8; r < t.length; r += 2)
                switch (t[r]) {
                    case "raddr":
                        n.relatedAddress = t[r + 1];
                        break;
                    case "rport":
                        n.relatedPort = parseInt(t[r + 1], 10);
                        break;
                    case "tcptype":
                        n.tcpType = t[r + 1];
                        break;
                    case "ufrag":
                        n.ufrag = t[r + 1],
                            n.usernameFragment = t[r + 1];
                        break;
                    default:
                        n[t[r]] = t[r + 1]
                }
            return n
        }
        ,
        r.writeCandidate = function (e) {
            var t = [];
            t.push(e.foundation),
                t.push(e.component),
                t.push(e.protocol.toUpperCase()),
                t.push(e.priority),
                t.push(e.address || e.ip),
                t.push(e.port);
            var n = e.type;
            return t.push("typ"),
                t.push(n),
                "host" !== n && e.relatedAddress && e.relatedPort && (t.push("raddr"),
                    t.push(e.relatedAddress),
                    t.push("rport"),
                    t.push(e.relatedPort)),
                e.tcpType && "tcp" === e.protocol.toLowerCase() && (t.push("tcptype"),
                    t.push(e.tcpType)),
                (e.usernameFragment || e.ufrag) && (t.push("ufrag"),
                    t.push(e.usernameFragment || e.ufrag)),
                "candidate:" + t.join(" ")
        }
        ,
        r.parseIceOptions = function (e) {
            return e.substr(14).split(" ")
        }
        ,
        r.parseRtpMap = function (e) {
            var t = e.substr(9).split(" ")
                , n = {
                    payloadType: parseInt(t.shift(), 10)
                };
            return t = t[0].split("/"),
                n.name = t[0],
                n.clockRate = parseInt(t[1], 10),
                n.channels = 3 === t.length ? parseInt(t[2], 10) : 1,
                n.numChannels = n.channels,
                n
        }
        ,
        r.writeRtpMap = function (e) {
            var t = e.payloadType;
            void 0 !== e.preferredPayloadType && (t = e.preferredPayloadType);
            var n = e.channels || e.numChannels || 1;
            return "a=rtpmap:" + t + " " + e.name + "/" + e.clockRate + (1 !== n ? "/" + n : "") + "\r\n"
        }
        ,
        r.parseExtmap = function (e) {
            var t = e.substr(9).split(" ");
            return {
                id: parseInt(t[0], 10),
                direction: t[0].indexOf("/") > 0 ? t[0].split("/")[1] : "sendrecv",
                uri: t[1]
            }
        }
        ,
        r.writeExtmap = function (e) {
            return "a=extmap:" + (e.id || e.preferredId) + (e.direction && "sendrecv" !== e.direction ? "/" + e.direction : "") + " " + e.uri + "\r\n"
        }
        ,
        r.parseFmtp = function (e) {
            for (var t, n = {}, r = e.substr(e.indexOf(" ") + 1).split(";"), i = 0; i < r.length; i++)
                n[(t = r[i].trim().split("="))[0].trim()] = t[1];
            return n
        }
        ,
        r.writeFmtp = function (e) {
            var t = ""
                , n = e.payloadType;
            if (void 0 !== e.preferredPayloadType && (n = e.preferredPayloadType),
                e.parameters && Object.keys(e.parameters).length) {
                var r = [];
                Object.keys(e.parameters).forEach((function (t) {
                    e.parameters[t] ? r.push(t + "=" + e.parameters[t]) : r.push(t)
                }
                )),
                    t += "a=fmtp:" + n + " " + r.join(";") + "\r\n"
            }
            return t
        }
        ,
        r.parseRtcpFb = function (e) {
            var t = e.substr(e.indexOf(" ") + 1).split(" ");
            return {
                type: t.shift(),
                parameter: t.join(" ")
            }
        }
        ,
        r.writeRtcpFb = function (e) {
            var t = ""
                , n = e.payloadType;
            return void 0 !== e.preferredPayloadType && (n = e.preferredPayloadType),
                e.rtcpFeedback && e.rtcpFeedback.length && e.rtcpFeedback.forEach((function (e) {
                    t += "a=rtcp-fb:" + n + " " + e.type + (e.parameter && e.parameter.length ? " " + e.parameter : "") + "\r\n"
                }
                )),
                t
        }
        ,
        r.parseSsrcMedia = function (e) {
            var t = e.indexOf(" ")
                , n = {
                    ssrc: parseInt(e.substr(7, t - 7), 10)
                }
                , r = e.indexOf(":", t);
            return r > -1 ? (n.attribute = e.substr(t + 1, r - t - 1),
                n.value = e.substr(r + 1)) : n.attribute = e.substr(t + 1),
                n
        }
        ,
        r.parseSsrcGroup = function (e) {
            var t = e.substr(13).split(" ");
            return {
                semantics: t.shift(),
                ssrcs: t.map((function (e) {
                    return parseInt(e, 10)
                }
                ))
            }
        }
        ,
        r.getMid = function (e) {
            var t = r.matchPrefix(e, "a=mid:")[0];
            if (t)
                return t.substr(6)
        }
        ,
        r.parseFingerprint = function (e) {
            var t = e.substr(14).split(" ");
            return {
                algorithm: t[0].toLowerCase(),
                value: t[1]
            }
        }
        ,
        r.getDtlsParameters = function (e, t) {
            return {
                role: "auto",
                fingerprints: r.matchPrefix(e + t, "a=fingerprint:").map(r.parseFingerprint)
            }
        }
        ,
        r.writeDtlsParameters = function (e, t) {
            var n = "a=setup:" + t + "\r\n";
            return e.fingerprints.forEach((function (e) {
                n += "a=fingerprint:" + e.algorithm + " " + e.value + "\r\n"
            }
            )),
                n
        }
        ,
        r.parseCryptoLine = function (e) {
            var t = e.substr(9).split(" ");
            return {
                tag: parseInt(t[0], 10),
                cryptoSuite: t[1],
                keyParams: t[2],
                sessionParams: t.slice(3)
            }
        }
        ,
        r.writeCryptoLine = function (e) {
            return "a=crypto:" + e.tag + " " + e.cryptoSuite + " " + ("object" == typeof e.keyParams ? r.writeCryptoKeyParams(e.keyParams) : e.keyParams) + (e.sessionParams ? " " + e.sessionParams.join(" ") : "") + "\r\n"
        }
        ,
        r.parseCryptoKeyParams = function (e) {
            if (0 !== e.indexOf("inline:"))
                return null;
            var t = e.substr(7).split("|");
            return {
                keyMethod: "inline",
                keySalt: t[0],
                lifeTime: t[1],
                mkiValue: t[2] ? t[2].split(":")[0] : void 0,
                mkiLength: t[2] ? t[2].split(":")[1] : void 0
            }
        }
        ,
        r.writeCryptoKeyParams = function (e) {
            return e.keyMethod + ":" + e.keySalt + (e.lifeTime ? "|" + e.lifeTime : "") + (e.mkiValue && e.mkiLength ? "|" + e.mkiValue + ":" + e.mkiLength : "")
        }
        ,
        r.getCryptoParameters = function (e, t) {
            return r.matchPrefix(e + t, "a=crypto:").map(r.parseCryptoLine)
        }
        ,
        r.getIceParameters = function (e, t) {
            var n = r.matchPrefix(e + t, "a=ice-ufrag:")[0]
                , i = r.matchPrefix(e + t, "a=ice-pwd:")[0];
            return n && i ? {
                usernameFragment: n.substr(12),
                password: i.substr(10)
            } : null
        }
        ,
        r.writeIceParameters = function (e) {
            return "a=ice-ufrag:" + e.usernameFragment + "\r\na=ice-pwd:" + e.password + "\r\n"
        }
        ,
        r.parseRtpParameters = function (e) {
            for (var t = {
                codecs: [],
                headerExtensions: [],
                fecMechanisms: [],
                rtcp: []
            }, n = r.splitLines(e)[0].split(" "), i = 3; i < n.length; i++) {
                var o = n[i]
                    , a = r.matchPrefix(e, "a=rtpmap:" + o + " ")[0];
                if (a) {
                    var s = r.parseRtpMap(a)
                        , c = r.matchPrefix(e, "a=fmtp:" + o + " ");
                    switch (s.parameters = c.length ? r.parseFmtp(c[0]) : {},
                    s.rtcpFeedback = r.matchPrefix(e, "a=rtcp-fb:" + o + " ").map(r.parseRtcpFb),
                    t.codecs.push(s),
                    s.name.toUpperCase()) {
                        case "RED":
                        case "ULPFEC":
                            t.fecMechanisms.push(s.name.toUpperCase())
                    }
                }
            }
            return r.matchPrefix(e, "a=extmap:").forEach((function (e) {
                t.headerExtensions.push(r.parseExtmap(e))
            }
            )),
                t
        }
        ,
        r.writeRtpDescription = function (e, t) {
            var n = "";
            n += "m=" + e + " ",
                n += t.codecs.length > 0 ? "9" : "0",
                n += " UDP/TLS/RTP/SAVPF ",
                n += t.codecs.map((function (e) {
                    return void 0 !== e.preferredPayloadType ? e.preferredPayloadType : e.payloadType
                }
                )).join(" ") + "\r\n",
                n += "c=IN IP4 0.0.0.0\r\n",
                n += "a=rtcp:9 IN IP4 0.0.0.0\r\n",
                t.codecs.forEach((function (e) {
                    n += r.writeRtpMap(e),
                        n += r.writeFmtp(e),
                        n += r.writeRtcpFb(e)
                }
                ));
            var i = 0;
            return t.codecs.forEach((function (e) {
                e.maxptime > i && (i = e.maxptime)
            }
            )),
                i > 0 && (n += "a=maxptime:" + i + "\r\n"),
                n += "a=rtcp-mux\r\n",
                t.headerExtensions && t.headerExtensions.forEach((function (e) {
                    n += r.writeExtmap(e)
                }
                )),
                n
        }
        ,
        r.parseRtpEncodingParameters = function (e) {
            var t, n = [], i = r.parseRtpParameters(e), o = -1 !== i.fecMechanisms.indexOf("RED"), a = -1 !== i.fecMechanisms.indexOf("ULPFEC"), s = r.matchPrefix(e, "a=ssrc:").map((function (e) {
                return r.parseSsrcMedia(e)
            }
            )).filter((function (e) {
                return "cname" === e.attribute
            }
            )), c = s.length > 0 && s[0].ssrc, l = r.matchPrefix(e, "a=ssrc-group:FID").map((function (e) {
                return e.substr(17).split(" ").map((function (e) {
                    return parseInt(e, 10)
                }
                ))
            }
            ));
            l.length > 0 && l[0].length > 1 && l[0][0] === c && (t = l[0][1]),
                i.codecs.forEach((function (e) {
                    if ("RTX" === e.name.toUpperCase() && e.parameters.apt) {
                        var r = {
                            ssrc: c,
                            codecPayloadType: parseInt(e.parameters.apt, 10)
                        };
                        c && t && (r.rtx = {
                            ssrc: t
                        }),
                            n.push(r),
                            o && ((r = JSON.parse(JSON.stringify(r))).fec = {
                                ssrc: c,
                                mechanism: a ? "red+ulpfec" : "red"
                            },
                                n.push(r))
                    }
                }
                )),
                0 === n.length && c && n.push({
                    ssrc: c
                });
            var d = r.matchPrefix(e, "b=");
            return d.length && (d = 0 === d[0].indexOf("b=TIAS:") ? parseInt(d[0].substr(7), 10) : 0 === d[0].indexOf("b=AS:") ? 1e3 * parseInt(d[0].substr(5), 10) * .95 - 16e3 : void 0,
                n.forEach((function (e) {
                    e.maxBitrate = d
                }
                ))),
                n
        }
        ,
        r.parseRtcpParameters = function (e) {
            var t = {}
                , n = r.matchPrefix(e, "a=ssrc:").map((function (e) {
                    return r.parseSsrcMedia(e)
                }
                )).filter((function (e) {
                    return "cname" === e.attribute
                }
                ))[0];
            n && (t.cname = n.value,
                t.ssrc = n.ssrc);
            var i = r.matchPrefix(e, "a=rtcp-rsize");
            t.reducedSize = i.length > 0,
                t.compound = 0 === i.length;
            var o = r.matchPrefix(e, "a=rtcp-mux");
            return t.mux = o.length > 0,
                t
        }
        ,
        r.parseMsid = function (e) {
            var t, n = r.matchPrefix(e, "a=msid:");
            if (1 === n.length)
                return {
                    stream: (t = n[0].substr(7).split(" "))[0],
                    track: t[1]
                };
            var i = r.matchPrefix(e, "a=ssrc:").map((function (e) {
                return r.parseSsrcMedia(e)
            }
            )).filter((function (e) {
                return "msid" === e.attribute
            }
            ));
            return i.length > 0 ? {
                stream: (t = i[0].value.split(" "))[0],
                track: t[1]
            } : void 0
        }
        ,
        r.parseSctpDescription = function (e) {
            var t, n = r.parseMLine(e), i = r.matchPrefix(e, "a=max-message-size:");
            i.length > 0 && (t = parseInt(i[0].substr(19), 10)),
                isNaN(t) && (t = 65536);
            var o = r.matchPrefix(e, "a=sctp-port:");
            if (o.length > 0)
                return {
                    port: parseInt(o[0].substr(12), 10),
                    protocol: n.fmt,
                    maxMessageSize: t
                };
            if (r.matchPrefix(e, "a=sctpmap:").length > 0) {
                var a = r.matchPrefix(e, "a=sctpmap:")[0].substr(10).split(" ");
                return {
                    port: parseInt(a[0], 10),
                    protocol: a[1],
                    maxMessageSize: t
                }
            }
        }
        ,
        r.writeSctpDescription = function (e, t) {
            var n = [];
            return n = "DTLS/SCTP" !== e.protocol ? ["m=" + e.kind + " 9 " + e.protocol + " " + t.protocol + "\r\n", "c=IN IP4 0.0.0.0\r\n", "a=sctp-port:" + t.port + "\r\n"] : ["m=" + e.kind + " 9 " + e.protocol + " " + t.port + "\r\n", "c=IN IP4 0.0.0.0\r\n", "a=sctpmap:" + t.port + " " + t.protocol + " 65535\r\n"],
                void 0 !== t.maxMessageSize && n.push("a=max-message-size:" + t.maxMessageSize + "\r\n"),
                n.join("")
        }
        ,
        r.generateSessionId = function () {
            return Math.random().toString().substr(2, 21)
        }
        ,
        r.writeSessionBoilerplate = function (e, t, n) {
            var i = void 0 !== t ? t : 2;
            return "v=0\r\no=" + (n || "thisisadapterortc") + " " + (e || r.generateSessionId()) + " " + i + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"
        }
        ,
        r.writeMediaSection = function (e, t, n, i) {
            var o = r.writeRtpDescription(e.kind, t);
            if (o += r.writeIceParameters(e.iceGatherer.getLocalParameters()),
                o += r.writeDtlsParameters(e.dtlsTransport.getLocalParameters(), "offer" === n ? "actpass" : "active"),
                o += "a=mid:" + e.mid + "\r\n",
                e.direction ? o += "a=" + e.direction + "\r\n" : e.rtpSender && e.rtpReceiver ? o += "a=sendrecv\r\n" : e.rtpSender ? o += "a=sendonly\r\n" : e.rtpReceiver ? o += "a=recvonly\r\n" : o += "a=inactive\r\n",
                e.rtpSender) {
                var a = "msid:" + i.id + " " + e.rtpSender.track.id + "\r\n";
                o += "a=" + a,
                    o += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " " + a,
                    e.sendEncodingParameters[0].rtx && (o += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " " + a,
                        o += "a=ssrc-group:FID " + e.sendEncodingParameters[0].ssrc + " " + e.sendEncodingParameters[0].rtx.ssrc + "\r\n")
            }
            return o += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " cname:" + r.localCName + "\r\n",
                e.rtpSender && e.sendEncodingParameters[0].rtx && (o += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " cname:" + r.localCName + "\r\n"),
                o
        }
        ,
        r.getDirection = function (e, t) {
            for (var n = r.splitLines(e), i = 0; i < n.length; i++)
                switch (n[i]) {
                    case "a=sendrecv":
                    case "a=sendonly":
                    case "a=recvonly":
                    case "a=inactive":
                        return n[i].substr(2)
                }
            return t ? r.getDirection(t) : "sendrecv"
        }
        ,
        r.getKind = function (e) {
            return r.splitLines(e)[0].split(" ")[0].substr(2)
        }
        ,
        r.isRejected = function (e) {
            return "0" === e.split(" ", 2)[1]
        }
        ,
        r.parseMLine = function (e) {
            var t = r.splitLines(e)[0].substr(2).split(" ");
            return {
                kind: t[0],
                port: parseInt(t[1], 10),
                protocol: t[2],
                fmt: t.slice(3).join(" ")
            }
        }
        ,
        r.parseOLine = function (e) {
            var t = r.matchPrefix(e, "o=")[0].substr(2).split(" ");
            return {
                username: t[0],
                sessionId: t[1],
                sessionVersion: parseInt(t[2], 10),
                netType: t[3],
                addressType: t[4],
                address: t[5]
            }
        }
        ,
        r.isValidSDP = function (e) {
            if ("string" != typeof e || 0 === e.length)
                return !1;
            for (var t = r.splitLines(e), n = 0; n < t.length; n++)
                if (t[n].length < 2 || "=" !== t[n].charAt(1))
                    return !1;
            return !0
        }
        ,
        e.exports = r
}
    , function (e, t, n) {
        "use strict";
        var r = n(0);
        function i(e, t, n, i, o) {
            var a = r.writeRtpDescription(e.kind, t);
            if (a += r.writeIceParameters(e.iceGatherer.getLocalParameters()),
                a += r.writeDtlsParameters(e.dtlsTransport.getLocalParameters(), "offer" === n ? "actpass" : o || "active"),
                a += "a=mid:" + e.mid + "\r\n",
                e.rtpSender && e.rtpReceiver ? a += "a=sendrecv\r\n" : e.rtpSender ? a += "a=sendonly\r\n" : e.rtpReceiver ? a += "a=recvonly\r\n" : a += "a=inactive\r\n",
                e.rtpSender) {
                var s = e.rtpSender._initialTrackId || e.rtpSender.track.id;
                e.rtpSender._initialTrackId = s;
                var c = "msid:" + (i ? i.id : "-") + " " + s + "\r\n";
                a += "a=" + c,
                    a += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " " + c,
                    e.sendEncodingParameters[0].rtx && (a += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " " + c,
                        a += "a=ssrc-group:FID " + e.sendEncodingParameters[0].ssrc + " " + e.sendEncodingParameters[0].rtx.ssrc + "\r\n")
            }
            return a += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " cname:" + r.localCName + "\r\n",
                e.rtpSender && e.sendEncodingParameters[0].rtx && (a += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " cname:" + r.localCName + "\r\n"),
                a
        }
        function o(e, t) {
            var n = {
                codecs: [],
                headerExtensions: [],
                fecMechanisms: []
            }
                , r = function (e, t) {
                    e = parseInt(e, 10);
                    for (var n = 0; n < t.length; n++)
                        if (t[n].payloadType === e || t[n].preferredPayloadType === e)
                            return t[n]
                }
                , i = function (e, t, n, i) {
                    var o = r(e.parameters.apt, n)
                        , a = r(t.parameters.apt, i);
                    return o && a && o.name.toLowerCase() === a.name.toLowerCase()
                };
            return e.codecs.forEach((function (r) {
                for (var o = 0; o < t.codecs.length; o++) {
                    var a = t.codecs[o];
                    if (r.name.toLowerCase() === a.name.toLowerCase() && r.clockRate === a.clockRate) {
                        if ("rtx" === r.name.toLowerCase() && r.parameters && a.parameters.apt && !i(r, a, e.codecs, t.codecs))
                            continue;
                        (a = JSON.parse(JSON.stringify(a))).numChannels = Math.min(r.numChannels, a.numChannels),
                            n.codecs.push(a),
                            a.rtcpFeedback = a.rtcpFeedback.filter((function (e) {
                                for (var t = 0; t < r.rtcpFeedback.length; t++)
                                    if (r.rtcpFeedback[t].type === e.type && r.rtcpFeedback[t].parameter === e.parameter)
                                        return !0;
                                return !1
                            }
                            ));
                        break
                    }
                }
            }
            )),
                e.headerExtensions.forEach((function (e) {
                    for (var r = 0; r < t.headerExtensions.length; r++) {
                        var i = t.headerExtensions[r];
                        if (e.uri === i.uri) {
                            n.headerExtensions.push(i);
                            break
                        }
                    }
                }
                )),
                n
        }
        function a(e, t, n) {
            return -1 !== {
                offer: {
                    setLocalDescription: ["stable", "have-local-offer"],
                    setRemoteDescription: ["stable", "have-remote-offer"]
                },
                answer: {
                    setLocalDescription: ["have-remote-offer", "have-local-pranswer"],
                    setRemoteDescription: ["have-local-offer", "have-remote-pranswer"]
                }
            }[t][e].indexOf(n)
        }
        function s(e, t) {
            var n = e.getRemoteCandidates().find((function (e) {
                return t.foundation === e.foundation && t.ip === e.ip && t.port === e.port && t.priority === e.priority && t.protocol === e.protocol && t.type === e.type
            }
            ));
            return n || e.addRemoteCandidate(t),
                !n
        }
        function c(e, t) {
            var n = new Error(t);
            return n.name = e,
                n.code = {
                    NotSupportedError: 9,
                    InvalidStateError: 11,
                    InvalidAccessError: 15,
                    TypeError: void 0,
                    OperationError: void 0
                }[e],
                n
        }
        e.exports = function (e, t) {
            function n(t, n) {
                n.addTrack(t),
                    n.dispatchEvent(new e.MediaStreamTrackEvent("addtrack", {
                        track: t
                    }))
            }
            function l(t, n, r, i) {
                var o = new Event("track");
                o.track = n,
                    o.receiver = r,
                    o.transceiver = {
                        receiver: r
                    },
                    o.streams = i,
                    e.setTimeout((function () {
                        t._dispatchEvent("track", o)
                    }
                    ))
            }
            var d = function (n) {
                var i = this
                    , o = document.createDocumentFragment();
                if (["addEventListener", "removeEventListener", "dispatchEvent"].forEach((function (e) {
                    i[e] = o[e].bind(o)
                }
                )),
                    this.canTrickleIceCandidates = null,
                    this.needNegotiation = !1,
                    this.localStreams = [],
                    this.remoteStreams = [],
                    this._localDescription = null,
                    this._remoteDescription = null,
                    this.signalingState = "stable",
                    this.iceConnectionState = "new",
                    this.connectionState = "new",
                    this.iceGatheringState = "new",
                    n = JSON.parse(JSON.stringify(n || {})),
                    this.usingBundle = "max-bundle" === n.bundlePolicy,
                    "negotiate" === n.rtcpMuxPolicy)
                    throw c("NotSupportedError", "rtcpMuxPolicy 'negotiate' is not supported");
                switch (n.rtcpMuxPolicy || (n.rtcpMuxPolicy = "require"),
                n.iceTransportPolicy) {
                    case "all":
                    case "relay":
                        break;
                    default:
                        n.iceTransportPolicy = "all"
                }
                switch (n.bundlePolicy) {
                    case "balanced":
                    case "max-compat":
                    case "max-bundle":
                        break;
                    default:
                        n.bundlePolicy = "balanced"
                }
                if (n.iceServers = function (e, t) {
                    var n = !1;
                    return (e = JSON.parse(JSON.stringify(e))).filter((function (e) {
                        if (e && (e.urls || e.url)) {
                            var r = e.urls || e.url;
                            e.url && !e.urls && console.warn("RTCIceServer.url is deprecated! Use urls instead.");
                            var i = "string" == typeof r;
                            return i && (r = [r]),
                                r = r.filter((function (e) {
                                    return 0 === e.indexOf("turn:") && -1 !== e.indexOf("transport=udp") && -1 === e.indexOf("turn:[") && !n ? (n = !0,
                                        !0) : 0 === e.indexOf("stun:") && t >= 14393 && -1 === e.indexOf("?transport=udp")
                                }
                                )),
                                delete e.url,
                                e.urls = i ? r[0] : r,
                                !!r.length
                        }
                    }
                    ))
                }(n.iceServers || [], t),
                    this._iceGatherers = [],
                    n.iceCandidatePoolSize)
                    for (var a = n.iceCandidatePoolSize; a > 0; a--)
                        this._iceGatherers.push(new e.RTCIceGatherer({
                            iceServers: n.iceServers,
                            gatherPolicy: n.iceTransportPolicy
                        }));
                else
                    n.iceCandidatePoolSize = 0;
                this._config = n,
                    this.transceivers = [],
                    this._sdpSessionId = r.generateSessionId(),
                    this._sdpSessionVersion = 0,
                    this._dtlsRole = void 0,
                    this._isClosed = !1
            };
            Object.defineProperty(d.prototype, "localDescription", {
                configurable: !0,
                get: function () {
                    return this._localDescription
                }
            }),
                Object.defineProperty(d.prototype, "remoteDescription", {
                    configurable: !0,
                    get: function () {
                        return this._remoteDescription
                    }
                }),
                d.prototype.onicecandidate = null,
                d.prototype.onaddstream = null,
                d.prototype.ontrack = null,
                d.prototype.onremovestream = null,
                d.prototype.onsignalingstatechange = null,
                d.prototype.oniceconnectionstatechange = null,
                d.prototype.onconnectionstatechange = null,
                d.prototype.onicegatheringstatechange = null,
                d.prototype.onnegotiationneeded = null,
                d.prototype.ondatachannel = null,
                d.prototype._dispatchEvent = function (e, t) {
                    this._isClosed || (this.dispatchEvent(t),
                        "function" == typeof this["on" + e] && this["on" + e](t))
                }
                ,
                d.prototype._emitGatheringStateChange = function () {
                    var e = new Event("icegatheringstatechange");
                    this._dispatchEvent("icegatheringstatechange", e)
                }
                ,
                d.prototype.getConfiguration = function () {
                    return this._config
                }
                ,
                d.prototype.getLocalStreams = function () {
                    return this.localStreams
                }
                ,
                d.prototype.getRemoteStreams = function () {
                    return this.remoteStreams
                }
                ,
                d.prototype._createTransceiver = function (e, t) {
                    var n = this.transceivers.length > 0
                        , r = {
                            track: null,
                            iceGatherer: null,
                            iceTransport: null,
                            dtlsTransport: null,
                            localCapabilities: null,
                            remoteCapabilities: null,
                            rtpSender: null,
                            rtpReceiver: null,
                            kind: e,
                            mid: null,
                            sendEncodingParameters: null,
                            recvEncodingParameters: null,
                            stream: null,
                            associatedRemoteMediaStreams: [],
                            wantReceive: !0
                        };
                    if (this.usingBundle && n)
                        r.iceTransport = this.transceivers[0].iceTransport,
                            r.dtlsTransport = this.transceivers[0].dtlsTransport;
                    else {
                        var i = this._createIceAndDtlsTransports();
                        r.iceTransport = i.iceTransport,
                            r.dtlsTransport = i.dtlsTransport
                    }
                    return t || this.transceivers.push(r),
                        r
                }
                ,
                d.prototype.addTrack = function (t, n) {
                    if (this._isClosed)
                        throw c("InvalidStateError", "Attempted to call addTrack on a closed peerconnection.");
                    var r;
                    if (this.transceivers.find((function (e) {
                        return e.track === t
                    }
                    )))
                        throw c("InvalidAccessError", "Track already exists.");
                    for (var i = 0; i < this.transceivers.length; i++)
                        this.transceivers[i].track || this.transceivers[i].kind !== t.kind || (r = this.transceivers[i]);
                    return r || (r = this._createTransceiver(t.kind)),
                        this._maybeFireNegotiationNeeded(),
                        -1 === this.localStreams.indexOf(n) && this.localStreams.push(n),
                        r.track = t,
                        r.stream = n,
                        r.rtpSender = new e.RTCRtpSender(t, r.dtlsTransport),
                        r.rtpSender
                }
                ,
                d.prototype.addStream = function (e) {
                    var n = this;
                    if (t >= 15025)
                        e.getTracks().forEach((function (t) {
                            n.addTrack(t, e)
                        }
                        ));
                    else {
                        var r = e.clone();
                        e.getTracks().forEach((function (e, t) {
                            var n = r.getTracks()[t];
                            e.addEventListener("enabled", (function (e) {
                                n.enabled = e.enabled
                            }
                            ))
                        }
                        )),
                            r.getTracks().forEach((function (e) {
                                n.addTrack(e, r)
                            }
                            ))
                    }
                }
                ,
                d.prototype.removeTrack = function (t) {
                    if (this._isClosed)
                        throw c("InvalidStateError", "Attempted to call removeTrack on a closed peerconnection.");
                    if (!(t instanceof e.RTCRtpSender))
                        throw new TypeError("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.");
                    var n = this.transceivers.find((function (e) {
                        return e.rtpSender === t
                    }
                    ));
                    if (!n)
                        throw c("InvalidAccessError", "Sender was not created by this connection.");
                    var r = n.stream;
                    n.rtpSender.stop(),
                        n.rtpSender = null,
                        n.track = null,
                        n.stream = null,
                        -1 === this.transceivers.map((function (e) {
                            return e.stream
                        }
                        )).indexOf(r) && this.localStreams.indexOf(r) > -1 && this.localStreams.splice(this.localStreams.indexOf(r), 1),
                        this._maybeFireNegotiationNeeded()
                }
                ,
                d.prototype.removeStream = function (e) {
                    var t = this;
                    e.getTracks().forEach((function (e) {
                        var n = t.getSenders().find((function (t) {
                            return t.track === e
                        }
                        ));
                        n && t.removeTrack(n)
                    }
                    ))
                }
                ,
                d.prototype.getSenders = function () {
                    return this.transceivers.filter((function (e) {
                        return !!e.rtpSender
                    }
                    )).map((function (e) {
                        return e.rtpSender
                    }
                    ))
                }
                ,
                d.prototype.getReceivers = function () {
                    return this.transceivers.filter((function (e) {
                        return !!e.rtpReceiver
                    }
                    )).map((function (e) {
                        return e.rtpReceiver
                    }
                    ))
                }
                ,
                d.prototype._createIceGatherer = function (t, n) {
                    var r = this;
                    if (n && t > 0)
                        return this.transceivers[0].iceGatherer;
                    if (this._iceGatherers.length)
                        return this._iceGatherers.shift();
                    var i = new e.RTCIceGatherer({
                        iceServers: this._config.iceServers,
                        gatherPolicy: this._config.iceTransportPolicy
                    });
                    return Object.defineProperty(i, "state", {
                        value: "new",
                        writable: !0
                    }),
                        this.transceivers[t].bufferedCandidateEvents = [],
                        this.transceivers[t].bufferCandidates = function (e) {
                            var n = !e.candidate || 0 === Object.keys(e.candidate).length;
                            i.state = n ? "completed" : "gathering",
                                null !== r.transceivers[t].bufferedCandidateEvents && r.transceivers[t].bufferedCandidateEvents.push(e)
                        }
                        ,
                        i.addEventListener("localcandidate", this.transceivers[t].bufferCandidates),
                        i
                }
                ,
                d.prototype._gather = function (t, n) {
                    var i = this
                        , o = this.transceivers[n].iceGatherer;
                    if (!o.onlocalcandidate) {
                        var a = this.transceivers[n].bufferedCandidateEvents;
                        this.transceivers[n].bufferedCandidateEvents = null,
                            o.removeEventListener("localcandidate", this.transceivers[n].bufferCandidates),
                            o.onlocalcandidate = function (e) {
                                if (!(i.usingBundle && n > 0)) {
                                    var a = new Event("icecandidate");
                                    a.candidate = {
                                        sdpMid: t,
                                        sdpMLineIndex: n
                                    };
                                    var s = e.candidate
                                        , c = !s || 0 === Object.keys(s).length;
                                    if (c)
                                        "new" !== o.state && "gathering" !== o.state || (o.state = "completed");
                                    else {
                                        "new" === o.state && (o.state = "gathering"),
                                            s.component = 1,
                                            s.ufrag = o.getLocalParameters().usernameFragment;
                                        var l = r.writeCandidate(s);
                                        a.candidate = Object.assign(a.candidate, r.parseCandidate(l)),
                                            a.candidate.candidate = l,
                                            a.candidate.toJSON = function () {
                                                return {
                                                    candidate: a.candidate.candidate,
                                                    sdpMid: a.candidate.sdpMid,
                                                    sdpMLineIndex: a.candidate.sdpMLineIndex,
                                                    usernameFragment: a.candidate.usernameFragment
                                                }
                                            }
                                    }
                                    var d = r.getMediaSections(i._localDescription.sdp);
                                    d[a.candidate.sdpMLineIndex] += c ? "a=end-of-candidates\r\n" : "a=" + a.candidate.candidate + "\r\n",
                                        i._localDescription.sdp = r.getDescription(i._localDescription.sdp) + d.join("");
                                    var u = i.transceivers.every((function (e) {
                                        return e.iceGatherer && "completed" === e.iceGatherer.state
                                    }
                                    ));
                                    "gathering" !== i.iceGatheringState && (i.iceGatheringState = "gathering",
                                        i._emitGatheringStateChange()),
                                        c || i._dispatchEvent("icecandidate", a),
                                        u && (i._dispatchEvent("icecandidate", new Event("icecandidate")),
                                            i.iceGatheringState = "complete",
                                            i._emitGatheringStateChange())
                                }
                            }
                            ,
                            e.setTimeout((function () {
                                a.forEach((function (e) {
                                    o.onlocalcandidate(e)
                                }
                                ))
                            }
                            ), 0)
                    }
                }
                ,
                d.prototype._createIceAndDtlsTransports = function () {
                    var t = this
                        , n = new e.RTCIceTransport(null);
                    n.onicestatechange = function () {
                        t._updateIceConnectionState(),
                            t._updateConnectionState()
                    }
                        ;
                    var r = new e.RTCDtlsTransport(n);
                    return r.ondtlsstatechange = function () {
                        t._updateConnectionState()
                    }
                        ,
                        r.onerror = function () {
                            Object.defineProperty(r, "state", {
                                value: "failed",
                                writable: !0
                            }),
                                t._updateConnectionState()
                        }
                        ,
                    {
                        iceTransport: n,
                        dtlsTransport: r
                    }
                }
                ,
                d.prototype._disposeIceAndDtlsTransports = function (e) {
                    var t = this.transceivers[e].iceGatherer;
                    t && (delete t.onlocalcandidate,
                        delete this.transceivers[e].iceGatherer);
                    var n = this.transceivers[e].iceTransport;
                    n && (delete n.onicestatechange,
                        delete this.transceivers[e].iceTransport);
                    var r = this.transceivers[e].dtlsTransport;
                    r && (delete r.ondtlsstatechange,
                        delete r.onerror,
                        delete this.transceivers[e].dtlsTransport)
                }
                ,
                d.prototype._transceive = function (e, n, i) {
                    var a = o(e.localCapabilities, e.remoteCapabilities);
                    n && e.rtpSender && (a.encodings = e.sendEncodingParameters,
                        a.rtcp = {
                            cname: r.localCName,
                            compound: e.rtcpParameters.compound
                        },
                        e.recvEncodingParameters.length && (a.rtcp.ssrc = e.recvEncodingParameters[0].ssrc),
                        e.rtpSender.send(a)),
                        i && e.rtpReceiver && a.codecs.length > 0 && ("video" === e.kind && e.recvEncodingParameters && t < 15019 && e.recvEncodingParameters.forEach((function (e) {
                            delete e.rtx
                        }
                        )),
                            e.recvEncodingParameters.length ? a.encodings = e.recvEncodingParameters : a.encodings = [{}],
                            a.rtcp = {
                                compound: e.rtcpParameters.compound
                            },
                            e.rtcpParameters.cname && (a.rtcp.cname = e.rtcpParameters.cname),
                            e.sendEncodingParameters.length && (a.rtcp.ssrc = e.sendEncodingParameters[0].ssrc),
                            e.rtpReceiver.receive(a))
                }
                ,
                d.prototype.setLocalDescription = function (e) {
                    var t, n, i = this;
                    if (-1 === ["offer", "answer"].indexOf(e.type))
                        return Promise.reject(c("TypeError", 'Unsupported type "' + e.type + '"'));
                    if (!a("setLocalDescription", e.type, i.signalingState) || i._isClosed)
                        return Promise.reject(c("InvalidStateError", "Can not set local " + e.type + " in state " + i.signalingState));
                    if ("offer" === e.type)
                        t = r.splitSections(e.sdp),
                            n = t.shift(),
                            t.forEach((function (e, t) {
                                var n = r.parseRtpParameters(e);
                                i.transceivers[t].localCapabilities = n
                            }
                            )),
                            i.transceivers.forEach((function (e, t) {
                                i._gather(e.mid, t)
                            }
                            ));
                    else if ("answer" === e.type) {
                        t = r.splitSections(i._remoteDescription.sdp),
                            n = t.shift();
                        var s = r.matchPrefix(n, "a=ice-lite").length > 0;
                        t.forEach((function (e, t) {
                            var a = i.transceivers[t]
                                , c = a.iceGatherer
                                , l = a.iceTransport
                                , d = a.dtlsTransport
                                , u = a.localCapabilities
                                , p = a.remoteCapabilities;
                            if (!(r.isRejected(e) && 0 === r.matchPrefix(e, "a=bundle-only").length) && !a.rejected) {
                                var v = r.getIceParameters(e, n)
                                    , f = r.getDtlsParameters(e, n);
                                s && (f.role = "server"),
                                    i.usingBundle && 0 !== t || (i._gather(a.mid, t),
                                        "new" === l.state && l.start(c, v, s ? "controlling" : "controlled"),
                                        "new" === d.state && d.start(f));
                                var h = o(u, p);
                                i._transceive(a, h.codecs.length > 0, !1)
                            }
                        }
                        ))
                    }
                    return i._localDescription = {
                        type: e.type,
                        sdp: e.sdp
                    },
                        "offer" === e.type ? i._updateSignalingState("have-local-offer") : i._updateSignalingState("stable"),
                        Promise.resolve()
                }
                ,
                d.prototype.setRemoteDescription = function (i) {
                    var d = this;
                    if (-1 === ["offer", "answer"].indexOf(i.type))
                        return Promise.reject(c("TypeError", 'Unsupported type "' + i.type + '"'));
                    if (!a("setRemoteDescription", i.type, d.signalingState) || d._isClosed)
                        return Promise.reject(c("InvalidStateError", "Can not set remote " + i.type + " in state " + d.signalingState));
                    var u = {};
                    d.remoteStreams.forEach((function (e) {
                        u[e.id] = e
                    }
                    ));
                    var p = []
                        , v = r.splitSections(i.sdp)
                        , f = v.shift()
                        , h = r.matchPrefix(f, "a=ice-lite").length > 0
                        , m = r.matchPrefix(f, "a=group:BUNDLE ").length > 0;
                    d.usingBundle = m;
                    var g = r.matchPrefix(f, "a=ice-options:")[0];
                    return d.canTrickleIceCandidates = !!g && g.substr(14).split(" ").indexOf("trickle") >= 0,
                        v.forEach((function (a, c) {
                            var l = r.splitLines(a)
                                , v = r.getKind(a)
                                , g = r.isRejected(a) && 0 === r.matchPrefix(a, "a=bundle-only").length
                                , C = l[0].substr(2).split(" ")[2]
                                , S = r.getDirection(a, f)
                                , _ = r.parseMsid(a)
                                , T = r.getMid(a) || r.generateIdentifier();
                            if (g || "application" === v && ("DTLS/SCTP" === C || "UDP/DTLS/SCTP" === C))
                                d.transceivers[c] = {
                                    mid: T,
                                    kind: v,
                                    protocol: C,
                                    rejected: !0
                                };
                            else {
                                var E, y, R, I, k, O, A, b, M;
                                !g && d.transceivers[c] && d.transceivers[c].rejected && (d.transceivers[c] = d._createTransceiver(v, !0));
                                var P, w, D = r.parseRtpParameters(a);
                                g || (P = r.getIceParameters(a, f),
                                    (w = r.getDtlsParameters(a, f)).role = "client"),
                                    A = r.parseRtpEncodingParameters(a);
                                var N = r.parseRtcpParameters(a)
                                    , L = r.matchPrefix(a, "a=end-of-candidates", f).length > 0
                                    , F = r.matchPrefix(a, "a=candidate:").map((function (e) {
                                        return r.parseCandidate(e)
                                    }
                                    )).filter((function (e) {
                                        return 1 === e.component
                                    }
                                    ));
                                if (("offer" === i.type || "answer" === i.type) && !g && m && c > 0 && d.transceivers[c] && (d._disposeIceAndDtlsTransports(c),
                                    d.transceivers[c].iceGatherer = d.transceivers[0].iceGatherer,
                                    d.transceivers[c].iceTransport = d.transceivers[0].iceTransport,
                                    d.transceivers[c].dtlsTransport = d.transceivers[0].dtlsTransport,
                                    d.transceivers[c].rtpSender && d.transceivers[c].rtpSender.setTransport(d.transceivers[0].dtlsTransport),
                                    d.transceivers[c].rtpReceiver && d.transceivers[c].rtpReceiver.setTransport(d.transceivers[0].dtlsTransport)),
                                    "offer" !== i.type || g) {
                                    if ("answer" === i.type && !g) {
                                        y = (E = d.transceivers[c]).iceGatherer,
                                            R = E.iceTransport,
                                            I = E.dtlsTransport,
                                            k = E.rtpReceiver,
                                            O = E.sendEncodingParameters,
                                            b = E.localCapabilities,
                                            d.transceivers[c].recvEncodingParameters = A,
                                            d.transceivers[c].remoteCapabilities = D,
                                            d.transceivers[c].rtcpParameters = N,
                                            F.length && "new" === R.state && (!h && !L || m && 0 !== c ? F.forEach((function (e) {
                                                s(E.iceTransport, e)
                                            }
                                            )) : R.setRemoteCandidates(F)),
                                            m && 0 !== c || ("new" === R.state && R.start(y, P, "controlling"),
                                                "new" === I.state && I.start(w)),
                                            !o(E.localCapabilities, E.remoteCapabilities).codecs.filter((function (e) {
                                                return "rtx" === e.name.toLowerCase()
                                            }
                                            )).length && E.sendEncodingParameters[0].rtx && delete E.sendEncodingParameters[0].rtx,
                                            d._transceive(E, "sendrecv" === S || "recvonly" === S, "sendrecv" === S || "sendonly" === S),
                                            !k || "sendrecv" !== S && "sendonly" !== S ? delete E.rtpReceiver : (M = k.track,
                                                _ ? (u[_.stream] || (u[_.stream] = new e.MediaStream),
                                                    n(M, u[_.stream]),
                                                    p.push([M, k, u[_.stream]])) : (u.default || (u.default = new e.MediaStream),
                                                        n(M, u.default),
                                                        p.push([M, k, u.default])))
                                    }
                                } else {
                                    (E = d.transceivers[c] || d._createTransceiver(v)).mid = T,
                                        E.iceGatherer || (E.iceGatherer = d._createIceGatherer(c, m)),
                                        F.length && "new" === E.iceTransport.state && (!L || m && 0 !== c ? F.forEach((function (e) {
                                            s(E.iceTransport, e)
                                        }
                                        )) : E.iceTransport.setRemoteCandidates(F)),
                                        b = e.RTCRtpReceiver.getCapabilities(v),
                                        t < 15019 && (b.codecs = b.codecs.filter((function (e) {
                                            return "rtx" !== e.name
                                        }
                                        ))),
                                        O = E.sendEncodingParameters || [{
                                            ssrc: 1001 * (2 * c + 2)
                                        }];
                                    var V, x = !1;
                                    if ("sendrecv" === S || "sendonly" === S) {
                                        if (x = !E.rtpReceiver,
                                            k = E.rtpReceiver || new e.RTCRtpReceiver(E.dtlsTransport, v),
                                            x)
                                            M = k.track,
                                                _ && "-" === _.stream || (_ ? (u[_.stream] || (u[_.stream] = new e.MediaStream,
                                                    Object.defineProperty(u[_.stream], "id", {
                                                        get: function () {
                                                            return _.stream
                                                        }
                                                    })),
                                                    Object.defineProperty(M, "id", {
                                                        get: function () {
                                                            return _.track
                                                        }
                                                    }),
                                                    V = u[_.stream]) : (u.default || (u.default = new e.MediaStream),
                                                        V = u.default)),
                                                V && (n(M, V),
                                                    E.associatedRemoteMediaStreams.push(V)),
                                                p.push([M, k, V])
                                    } else
                                        E.rtpReceiver && E.rtpReceiver.track && (E.associatedRemoteMediaStreams.forEach((function (t) {
                                            var n = t.getTracks().find((function (e) {
                                                return e.id === E.rtpReceiver.track.id
                                            }
                                            ));
                                            n && function (t, n) {
                                                n.removeTrack(t),
                                                    n.dispatchEvent(new e.MediaStreamTrackEvent("removetrack", {
                                                        track: t
                                                    }))
                                            }(n, t)
                                        }
                                        )),
                                            E.associatedRemoteMediaStreams = []);
                                    E.localCapabilities = b,
                                        E.remoteCapabilities = D,
                                        E.rtpReceiver = k,
                                        E.rtcpParameters = N,
                                        E.sendEncodingParameters = O,
                                        E.recvEncodingParameters = A,
                                        d._transceive(d.transceivers[c], !1, x)
                                }
                            }
                        }
                        )),
                        void 0 === d._dtlsRole && (d._dtlsRole = "offer" === i.type ? "active" : "passive"),
                        d._remoteDescription = {
                            type: i.type,
                            sdp: i.sdp
                        },
                        "offer" === i.type ? d._updateSignalingState("have-remote-offer") : d._updateSignalingState("stable"),
                        Object.keys(u).forEach((function (t) {
                            var n = u[t];
                            if (n.getTracks().length) {
                                if (-1 === d.remoteStreams.indexOf(n)) {
                                    d.remoteStreams.push(n);
                                    var r = new Event("addstream");
                                    r.stream = n,
                                        e.setTimeout((function () {
                                            d._dispatchEvent("addstream", r)
                                        }
                                        ))
                                }
                                p.forEach((function (e) {
                                    var t = e[0]
                                        , r = e[1];
                                    n.id === e[2].id && l(d, t, r, [n])
                                }
                                ))
                            }
                        }
                        )),
                        p.forEach((function (e) {
                            e[2] || l(d, e[0], e[1], [])
                        }
                        )),
                        e.setTimeout((function () {
                            d && d.transceivers && d.transceivers.forEach((function (e) {
                                e.iceTransport && "new" === e.iceTransport.state && e.iceTransport.getRemoteCandidates().length > 0 && (console.warn("Timeout for addRemoteCandidate. Consider sending an end-of-candidates notification"),
                                    e.iceTransport.addRemoteCandidate({}))
                            }
                            ))
                        }
                        ), 4e3),
                        Promise.resolve()
                }
                ,
                d.prototype.close = function () {
                    this.transceivers.forEach((function (e) {
                        e.iceTransport && e.iceTransport.stop(),
                            e.dtlsTransport && e.dtlsTransport.stop(),
                            e.rtpSender && e.rtpSender.stop(),
                            e.rtpReceiver && e.rtpReceiver.stop()
                    }
                    )),
                        this._isClosed = !0,
                        this._updateSignalingState("closed")
                }
                ,
                d.prototype._updateSignalingState = function (e) {
                    this.signalingState = e;
                    var t = new Event("signalingstatechange");
                    this._dispatchEvent("signalingstatechange", t)
                }
                ,
                d.prototype._maybeFireNegotiationNeeded = function () {
                    var t = this;
                    "stable" === this.signalingState && !0 !== this.needNegotiation && (this.needNegotiation = !0,
                        e.setTimeout((function () {
                            if (t.needNegotiation) {
                                t.needNegotiation = !1;
                                var e = new Event("negotiationneeded");
                                t._dispatchEvent("negotiationneeded", e)
                            }
                        }
                        ), 0))
                }
                ,
                d.prototype._updateIceConnectionState = function () {
                    var e, t = {
                        new: 0,
                        closed: 0,
                        checking: 0,
                        connected: 0,
                        completed: 0,
                        disconnected: 0,
                        failed: 0
                    };
                    if (this.transceivers.forEach((function (e) {
                        e.iceTransport && !e.rejected && t[e.iceTransport.state]++
                    }
                    )),
                        e = "new",
                        t.failed > 0 ? e = "failed" : t.checking > 0 ? e = "checking" : t.disconnected > 0 ? e = "disconnected" : t.new > 0 ? e = "new" : t.connected > 0 ? e = "connected" : t.completed > 0 && (e = "completed"),
                        e !== this.iceConnectionState) {
                        this.iceConnectionState = e;
                        var n = new Event("iceconnectionstatechange");
                        this._dispatchEvent("iceconnectionstatechange", n)
                    }
                }
                ,
                d.prototype._updateConnectionState = function () {
                    var e, t = {
                        new: 0,
                        closed: 0,
                        connecting: 0,
                        connected: 0,
                        completed: 0,
                        disconnected: 0,
                        failed: 0
                    };
                    if (this.transceivers.forEach((function (e) {
                        e.iceTransport && e.dtlsTransport && !e.rejected && (t[e.iceTransport.state]++,
                            t[e.dtlsTransport.state]++)
                    }
                    )),
                        t.connected += t.completed,
                        e = "new",
                        t.failed > 0 ? e = "failed" : t.connecting > 0 ? e = "connecting" : t.disconnected > 0 ? e = "disconnected" : t.new > 0 ? e = "new" : t.connected > 0 && (e = "connected"),
                        e !== this.connectionState) {
                        this.connectionState = e;
                        var n = new Event("connectionstatechange");
                        this._dispatchEvent("connectionstatechange", n)
                    }
                }
                ,
                d.prototype.createOffer = function () {
                    var n = this;
                    if (n._isClosed)
                        return Promise.reject(c("InvalidStateError", "Can not call createOffer after close"));
                    var o = n.transceivers.filter((function (e) {
                        return "audio" === e.kind
                    }
                    )).length
                        , a = n.transceivers.filter((function (e) {
                            return "video" === e.kind
                        }
                        )).length
                        , s = arguments[0];
                    if (s) {
                        if (s.mandatory || s.optional)
                            throw new TypeError("Legacy mandatory/optional constraints not supported.");
                        void 0 !== s.offerToReceiveAudio && (o = !0 === s.offerToReceiveAudio ? 1 : !1 === s.offerToReceiveAudio ? 0 : s.offerToReceiveAudio),
                            void 0 !== s.offerToReceiveVideo && (a = !0 === s.offerToReceiveVideo ? 1 : !1 === s.offerToReceiveVideo ? 0 : s.offerToReceiveVideo)
                    }
                    for (n.transceivers.forEach((function (e) {
                        "audio" === e.kind ? --o < 0 && (e.wantReceive = !1) : "video" === e.kind && --a < 0 && (e.wantReceive = !1)
                    }
                    )); o > 0 || a > 0;)
                        o > 0 && (n._createTransceiver("audio"),
                            o--),
                            a > 0 && (n._createTransceiver("video"),
                                a--);
                    var l = r.writeSessionBoilerplate(n._sdpSessionId, n._sdpSessionVersion++);
                    n.transceivers.forEach((function (i, o) {
                        var a = i.track
                            , s = i.kind
                            , c = i.mid || r.generateIdentifier();
                        i.mid = c,
                            i.iceGatherer || (i.iceGatherer = n._createIceGatherer(o, n.usingBundle));
                        var l = e.RTCRtpSender.getCapabilities(s);
                        t < 15019 && (l.codecs = l.codecs.filter((function (e) {
                            return "rtx" !== e.name
                        }
                        ))),
                            l.codecs.forEach((function (e) {
                                "H264" === e.name && void 0 === e.parameters["level-asymmetry-allowed"] && (e.parameters["level-asymmetry-allowed"] = "1"),
                                    i.remoteCapabilities && i.remoteCapabilities.codecs && i.remoteCapabilities.codecs.forEach((function (t) {
                                        e.name.toLowerCase() === t.name.toLowerCase() && e.clockRate === t.clockRate && (e.preferredPayloadType = t.payloadType)
                                    }
                                    ))
                            }
                            )),
                            l.headerExtensions.forEach((function (e) {
                                (i.remoteCapabilities && i.remoteCapabilities.headerExtensions || []).forEach((function (t) {
                                    e.uri === t.uri && (e.id = t.id)
                                }
                                ))
                            }
                            ));
                        var d = i.sendEncodingParameters || [{
                            ssrc: 1001 * (2 * o + 1)
                        }];
                        a && t >= 15019 && "video" === s && !d[0].rtx && (d[0].rtx = {
                            ssrc: d[0].ssrc + 1
                        }),
                            i.wantReceive && (i.rtpReceiver = new e.RTCRtpReceiver(i.dtlsTransport, s)),
                            i.localCapabilities = l,
                            i.sendEncodingParameters = d
                    }
                    )),
                        "max-compat" !== n._config.bundlePolicy && (l += "a=group:BUNDLE " + n.transceivers.map((function (e) {
                            return e.mid
                        }
                        )).join(" ") + "\r\n"),
                        l += "a=ice-options:trickle\r\n",
                        n.transceivers.forEach((function (e, t) {
                            l += i(e, e.localCapabilities, "offer", e.stream, n._dtlsRole),
                                l += "a=rtcp-rsize\r\n",
                                !e.iceGatherer || "new" === n.iceGatheringState || 0 !== t && n.usingBundle || (e.iceGatherer.getLocalCandidates().forEach((function (e) {
                                    e.component = 1,
                                        l += "a=" + r.writeCandidate(e) + "\r\n"
                                }
                                )),
                                    "completed" === e.iceGatherer.state && (l += "a=end-of-candidates\r\n"))
                        }
                        ));
                    var d = new e.RTCSessionDescription({
                        type: "offer",
                        sdp: l
                    });
                    return Promise.resolve(d)
                }
                ,
                d.prototype.createAnswer = function () {
                    var n = this;
                    if (n._isClosed)
                        return Promise.reject(c("InvalidStateError", "Can not call createAnswer after close"));
                    if ("have-remote-offer" !== n.signalingState && "have-local-pranswer" !== n.signalingState)
                        return Promise.reject(c("InvalidStateError", "Can not call createAnswer in signalingState " + n.signalingState));
                    var a = r.writeSessionBoilerplate(n._sdpSessionId, n._sdpSessionVersion++);
                    n.usingBundle && (a += "a=group:BUNDLE " + n.transceivers.map((function (e) {
                        return e.mid
                    }
                    )).join(" ") + "\r\n"),
                        a += "a=ice-options:trickle\r\n";
                    var s = r.getMediaSections(n._remoteDescription.sdp).length;
                    n.transceivers.forEach((function (e, r) {
                        if (!(r + 1 > s)) {
                            if (e.rejected)
                                return "application" === e.kind ? "DTLS/SCTP" === e.protocol ? a += "m=application 0 DTLS/SCTP 5000\r\n" : a += "m=application 0 " + e.protocol + " webrtc-datachannel\r\n" : "audio" === e.kind ? a += "m=audio 0 UDP/TLS/RTP/SAVPF 0\r\na=rtpmap:0 PCMU/8000\r\n" : "video" === e.kind && (a += "m=video 0 UDP/TLS/RTP/SAVPF 120\r\na=rtpmap:120 VP8/90000\r\n"),
                                    void (a += "c=IN IP4 0.0.0.0\r\na=inactive\r\na=mid:" + e.mid + "\r\n");
                            var c;
                            if (e.stream)
                                "audio" === e.kind ? c = e.stream.getAudioTracks()[0] : "video" === e.kind && (c = e.stream.getVideoTracks()[0]),
                                    c && t >= 15019 && "video" === e.kind && !e.sendEncodingParameters[0].rtx && (e.sendEncodingParameters[0].rtx = {
                                        ssrc: e.sendEncodingParameters[0].ssrc + 1
                                    });
                            var l = o(e.localCapabilities, e.remoteCapabilities);
                            !l.codecs.filter((function (e) {
                                return "rtx" === e.name.toLowerCase()
                            }
                            )).length && e.sendEncodingParameters[0].rtx && delete e.sendEncodingParameters[0].rtx,
                                a += i(e, l, "answer", e.stream, n._dtlsRole),
                                e.rtcpParameters && e.rtcpParameters.reducedSize && (a += "a=rtcp-rsize\r\n")
                        }
                    }
                    ));
                    var l = new e.RTCSessionDescription({
                        type: "answer",
                        sdp: a
                    });
                    return Promise.resolve(l)
                }
                ,
                d.prototype.addIceCandidate = function (e) {
                    var t, n = this;
                    return e && void 0 === e.sdpMLineIndex && !e.sdpMid ? Promise.reject(new TypeError("sdpMLineIndex or sdpMid required")) : new Promise((function (i, o) {
                        if (!n._remoteDescription)
                            return o(c("InvalidStateError", "Can not add ICE candidate without a remote description"));
                        if (e && "" !== e.candidate) {
                            var a = e.sdpMLineIndex;
                            if (e.sdpMid)
                                for (var l = 0; l < n.transceivers.length; l++)
                                    if (n.transceivers[l].mid === e.sdpMid) {
                                        a = l;
                                        break
                                    }
                            var d = n.transceivers[a];
                            if (!d)
                                return o(c("OperationError", "Can not add ICE candidate"));
                            if (d.rejected)
                                return i();
                            var u = Object.keys(e.candidate).length > 0 ? r.parseCandidate(e.candidate) : {};
                            if ("tcp" === u.protocol && (0 === u.port || 9 === u.port))
                                return i();
                            if (u.component && 1 !== u.component)
                                return i();
                            if ((0 === a || a > 0 && d.iceTransport !== n.transceivers[0].iceTransport) && !s(d.iceTransport, u))
                                return o(c("OperationError", "Can not add ICE candidate"));
                            var p = e.candidate.trim();
                            0 === p.indexOf("a=") && (p = p.substr(2)),
                                (t = r.getMediaSections(n._remoteDescription.sdp))[a] += "a=" + (u.type ? p : "end-of-candidates") + "\r\n",
                                n._remoteDescription.sdp = r.getDescription(n._remoteDescription.sdp) + t.join("")
                        } else
                            for (var v = 0; v < n.transceivers.length && (n.transceivers[v].rejected || (n.transceivers[v].iceTransport.addRemoteCandidate({}),
                                (t = r.getMediaSections(n._remoteDescription.sdp))[v] += "a=end-of-candidates\r\n",
                                n._remoteDescription.sdp = r.getDescription(n._remoteDescription.sdp) + t.join(""),
                                !n.usingBundle)); v++)
                                ;
                        i()
                    }
                    ))
                }
                ,
                d.prototype.getStats = function (t) {
                    if (t && t instanceof e.MediaStreamTrack) {
                        var n = null;
                        if (this.transceivers.forEach((function (e) {
                            e.rtpSender && e.rtpSender.track === t ? n = e.rtpSender : e.rtpReceiver && e.rtpReceiver.track === t && (n = e.rtpReceiver)
                        }
                        )),
                            !n)
                            throw c("InvalidAccessError", "Invalid selector.");
                        return n.getStats()
                    }
                    var r = [];
                    return this.transceivers.forEach((function (e) {
                        ["rtpSender", "rtpReceiver", "iceGatherer", "iceTransport", "dtlsTransport"].forEach((function (t) {
                            e[t] && r.push(e[t].getStats())
                        }
                        ))
                    }
                    )),
                        Promise.all(r).then((function (e) {
                            var t = new Map;
                            return e.forEach((function (e) {
                                e.forEach((function (e) {
                                    t.set(e.id, e)
                                }
                                ))
                            }
                            )),
                                t
                        }
                        ))
                }
                ;
            ["RTCRtpSender", "RTCRtpReceiver", "RTCIceGatherer", "RTCIceTransport", "RTCDtlsTransport"].forEach((function (t) {
                var n = e[t];
                if (n && n.prototype && n.prototype.getStats) {
                    var r = n.prototype.getStats;
                    n.prototype.getStats = function () {
                        return r.apply(this).then((function (e) {
                            var t = new Map;
                            return Object.keys(e).forEach((function (n) {
                                var r;
                                e[n].type = {
                                    inboundrtp: "inbound-rtp",
                                    outboundrtp: "outbound-rtp",
                                    candidatepair: "candidate-pair",
                                    localcandidate: "local-candidate",
                                    remotecandidate: "remote-candidate"
                                }[(r = e[n]).type] || r.type,
                                    t.set(n, e[n])
                            }
                            )),
                                t
                        }
                        ))
                    }
                }
            }
            ));
            var u = ["createOffer", "createAnswer"];
            return u.forEach((function (e) {
                var t = d.prototype[e];
                d.prototype[e] = function () {
                    var e = arguments;
                    return "function" == typeof e[0] || "function" == typeof e[1] ? t.apply(this, [arguments[2]]).then((function (t) {
                        "function" == typeof e[0] && e[0].apply(null, [t])
                    }
                    ), (function (t) {
                        "function" == typeof e[1] && e[1].apply(null, [t])
                    }
                    )) : t.apply(this, arguments)
                }
            }
            )),
                (u = ["setLocalDescription", "setRemoteDescription", "addIceCandidate"]).forEach((function (e) {
                    var t = d.prototype[e];
                    d.prototype[e] = function () {
                        var e = arguments;
                        return "function" == typeof e[1] || "function" == typeof e[2] ? t.apply(this, arguments).then((function () {
                            "function" == typeof e[1] && e[1].apply(null)
                        }
                        ), (function (t) {
                            "function" == typeof e[2] && e[2].apply(null, [t])
                        }
                        )) : t.apply(this, arguments)
                    }
                }
                )),
                ["getStats"].forEach((function (e) {
                    var t = d.prototype[e];
                    d.prototype[e] = function () {
                        var e = arguments;
                        return "function" == typeof e[1] ? t.apply(this, arguments).then((function () {
                            "function" == typeof e[1] && e[1].apply(null)
                        }
                        )) : t.apply(this, arguments)
                    }
                }
                )),
                d
        }
    }
    , function (e, t, n) {
        "use strict";
        n.r(t);
        var r = {};
        n.r(r),
            n.d(r, "shimGetUserMedia", (function () {
                return A
            }
            )),
            n.d(r, "shimGetDisplayMedia", (function () {
                return b
            }
            )),
            n.d(r, "shimMediaStream", (function () {
                return M
            }
            )),
            n.d(r, "shimOnTrack", (function () {
                return P
            }
            )),
            n.d(r, "shimGetSendersWithDtmf", (function () {
                return w
            }
            )),
            n.d(r, "shimGetStats", (function () {
                return D
            }
            )),
            n.d(r, "shimSenderReceiverGetStats", (function () {
                return N
            }
            )),
            n.d(r, "shimAddTrackRemoveTrackWithNative", (function () {
                return L
            }
            )),
            n.d(r, "shimAddTrackRemoveTrack", (function () {
                return F
            }
            )),
            n.d(r, "shimPeerConnection", (function () {
                return V
            }
            )),
            n.d(r, "fixNegotiationNeeded", (function () {
                return x
            }
            ));
        var i = {};
        n.r(i),
            n.d(i, "shimGetUserMedia", (function () {
                return j
            }
            )),
            n.d(i, "shimGetDisplayMedia", (function () {
                return H
            }
            )),
            n.d(i, "shimPeerConnection", (function () {
                return B
            }
            )),
            n.d(i, "shimReplaceTrack", (function () {
                return q
            }
            ));
        var o = {};
        n.r(o),
            n.d(o, "shimGetUserMedia", (function () {
                return K
            }
            )),
            n.d(o, "shimGetDisplayMedia", (function () {
                return J
            }
            )),
            n.d(o, "shimOnTrack", (function () {
                return W
            }
            )),
            n.d(o, "shimPeerConnection", (function () {
                return z
            }
            )),
            n.d(o, "shimSenderGetStats", (function () {
                return Q
            }
            )),
            n.d(o, "shimReceiverGetStats", (function () {
                return Y
            }
            )),
            n.d(o, "shimRemoveStream", (function () {
                return X
            }
            )),
            n.d(o, "shimRTCDataChannel", (function () {
                return $
            }
            )),
            n.d(o, "shimAddTransceiver", (function () {
                return Z
            }
            )),
            n.d(o, "shimCreateOffer", (function () {
                return ee
            }
            )),
            n.d(o, "shimCreateAnswer", (function () {
                return te
            }
            ));
        var a = {};
        n.r(a),
            n.d(a, "shimLocalStreamsAPI", (function () {
                return ne
            }
            )),
            n.d(a, "shimRemoteStreamsAPI", (function () {
                return re
            }
            )),
            n.d(a, "shimCallbacksAPI", (function () {
                return ie
            }
            )),
            n.d(a, "shimGetUserMedia", (function () {
                return oe
            }
            )),
            n.d(a, "shimConstraints", (function () {
                return ae
            }
            )),
            n.d(a, "shimRTCIceServerUrls", (function () {
                return se
            }
            )),
            n.d(a, "shimTrackEventTransceiver", (function () {
                return ce
            }
            )),
            n.d(a, "shimCreateOfferLegacy", (function () {
                return le
            }
            ));
        var s = {};
        n.r(s),
            n.d(s, "shimRTCIceCandidate", (function () {
                return pe
            }
            )),
            n.d(s, "shimMaxMessageSize", (function () {
                return ve
            }
            )),
            n.d(s, "shimSendThrowTypeError", (function () {
                return fe
            }
            )),
            n.d(s, "shimConnectionState", (function () {
                return he
            }
            )),
            n.d(s, "removeAllowExtmapMixed", (function () {
                return me
            }
            ));
        var c = {
            PING: 1,
            AUTHEN: 2,
            MESSAGE_TYPE_RATING: 14,
            CALL_START: 26,
            CALL_SDP_CANDIDATE: 27,
            CALL_STOP: 28,
            CALL_SDP_CANDIDATE_FROM_SERVER: 29,
            CALL_STOP_FROM_SERVER: 30,
            CALL_STATE: 31,
            CALL_STATE_FROM_SERVER: 32,
            CALL_START_FROM_SERVER: 33,
            CALL_DTMF: 34,
            CALL_DTMF_FROM_SERVER: 35,
            CALL_INFO: 36,
            CALL_INFO_FROM_SERVER: 37,
            MSG_FROM_OTHER_DEVICE: 38,
            PUSH_DEVICE_TOKEN_REGISTER: 39,
            PUSH_DEVICE_TOKEN_UNREGISTER: 40,
            CHAT_CREATE_CONVERSATION: 41,
            CHAT_MESSAGE: 42,
            CHAT_MESSAGE_FROM_SERVER: 45,
            CHAT_MESSAGE_REPORT: 46,
            CHAT_MESSAGE_REPORT_FROM_SERVER: 47,
            CHAT_CONVERSATION_LOAD: 48,
            CHAT_MESSAGES_LOAD: 50,
            CHAT_CONVERSATION_CLEAR_HISTORY: 51,
            CHAT_DELETE_CONVERSATION: 52,
            CUSTOM_MESSAGE: 54,
            CUSTOM_MESSAGE_FROM_SERVER: 55,
            CHAT_GET_USERS_INFO: 56,
            CHAT_GET_CONVERSATIONS_INFO: 57,
            CHAT_ADD_PARTICIPANT: 58,
            CHAT_ADD_PARTICIPANT_FROM_SERVER: 59,
            CHAT_REMOVE_PARTICIPANT: 60,
            CHAT_REMOVE_PARTICIPANT_FROM_SERVER: 61,
            CHAT_DELETE_MESSAGE: 62,
            CHAT_UPDATE_CONVERSATION: 63,
            CHAT_ROUTE_TO_AGENT: 64,
            CHAT_AGENT_RESPONSE: 65,
            TIMEOUT_ROUTE_TO_AGENT: 66,
            TIMEOUT_ROUTE_TO_QUEUE: 67,
            END_CHAT: 68,
            RATE_CHAT: 69,
            UPDATE_USER_INFO: 70,
            SEND_EMAIL_TRANSCRIPT: 71,
            GET_CHAT_SERVICES: 72,
            VIEW_CHAT: 73,
            JOIN_CHAT_CUSTOMER_CARE: 74,
            CHAT_TRANSFER_TO_ANOTHER_AGENT: 77,
            CHAT_UNREAD_CONVERSATION_COUNT: 76,
            CHAT_CONFIRM_TRANSFER_REQUEST: 78,
            CHAT_TRANSFER_REQUEST_FROM_ANOTHER_AGENT: 79,
            UPDATE_USER_INFO_NOTIFICATION: 81,
            CHAT_USER_BEGIN_TYPING: 84,
            CHAT_USER_END_TYPING: 85,
            CHAT_USER_BEGIN_TYPING_NOTIFICATION: 86,
            CHAT_USER_END_TYPING_NOTIFIACTION: 87,
            CHAT_AGENT_RESOLVE_CONVERSATION: 94,
            CHAT_CONVERSATION_ATTACHMENT: 95,
            CHAT_LOAD_ALL_MESSAGES_FOR_CONVERSATIONS: 97,
            HOLD: 100,
            TRANSFER: 101,
            SUBSCRIBE_FROM_SERVER: 102,
            CHANGE_ATTRIBUTE: 103,
            OTHER_DEVICE_AUTHEN: 104,
            CHAT_BLOCK_USER: 105,
            VIDEO_ENDPOINT_SDP: 108,
            VIDEO_ENDPOINT_CANDIDATE: 109,
            VIDEO_ENDPOINT_SDP_FROM_SERVER: 110,
            VIDEO_ENDPOINT_CANDIDATE_FROM_SERVER: 111,
            VIDEO_ENDPOINT_MAKE_ROOM: 112,
            VIDEO_ENDPOINT_JOIN_ROOM: 115,
            VIDEO_LEFT_ROOM: 116,
            VIDEO_PUBLISH_TRACK: 117,
            VIDEO_UNPUBLISH_TRACK: 118,
            VIDEO_SUBSCRIBE_TRACK: 119,
            VIDEO_UNSUBSCRIBE_TRACK: 120,
            VIDEO_TRACK_ADDED_FROM_SERVER: 121,
            VIDEO_TRACK_REMOVED_FROM_SERVER: 122,
            VIDEO_ROOM_JOINED_FROM_SERVER: 124,
            VIDEO_ROOM_LEFT_FROM_SERVER: 125,
            VIDEO_ROOM_SEND_MSG: 126,
            VIDEO_ROOM_MSG_FROM_SERVER: 127,
            VIDEO_ROOM_MAKE_CALL: 128,
            VIDEO_ROOM_CALL_INVITE: 129,
            VIDEO_ROOM_CALL_INVITE_CANCEL: 130,
            VIDEO_ROOM_CALL_STATE: 131,
            VIDEO_ROOM_END_CALL: 132,
            VIDEO_ROOM_END_CALL_FROM_SERVER: 133,
            VIDEO_ROOM_CALL_STATE_FROM_SERVER: 134
        };
        var l = function e() {
            !function (e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function")
            }(this, e);
            var t = [];
            return t.size = function () {
                return this.length
            }
                ,
                t.isEmpty = function () {
                    return 0 === this.length
                }
                ,
                t.containsKey = function (e) {
                    e += "";
                    for (var t = 0; t < this.length; t++)
                        if (this[t].key === e)
                            return t;
                    return -1
                }
                ,
                t.get = function (e) {
                    e += "";
                    var t = this.containsKey(e);
                    if (t > -1)
                        return this[t].value
                }
                ,
                t.put = function (e, t) {
                    if (e += "",
                        -1 !== this.containsKey(e))
                        return this.get(e);
                    this.push({
                        key: e,
                        value: t
                    })
                }
                ,
                t.allKeys = function () {
                    for (var e = [], t = 0; t < this.length; t++)
                        e.push(this[t].key);
                    return e
                }
                ,
                t.allIntKeys = function () {
                    for (var e = [], t = 0; t < this.length; t++)
                        e.push(parseInt(this[t].key));
                    return e
                }
                ,
                t.remove = function (e) {
                    e += "";
                    var t = this.containsKey(e);
                    t > -1 && this.splice(t, 1)
                }
                ,
                t.clear = function () {
                    for (var e = this.allKeys(), t = 0; t < e.length; t++) {
                        var n = e[t];
                        this.remove(n)
                    }
                }
                ,
                t
        }
            , d = 1
            , u = 2
            , p = 3
            , v = 5
            , f = 6;
        let h = !0
            , m = !0;
        function g(e, t, n) {
            const r = e.match(t);
            return r && r.length >= n && parseInt(r[n], 10)
        }
        function C(e, t, n) {
            if (!e.RTCPeerConnection)
                return;
            const r = e.RTCPeerConnection.prototype
                , i = r.addEventListener;
            r.addEventListener = function (e, r) {
                if (e !== t)
                    return i.apply(this, arguments);
                const o = e => {
                    const t = n(e);
                    t && r(t)
                }
                    ;
                return this._eventMap = this._eventMap || {},
                    this._eventMap[r] = o,
                    i.apply(this, [e, o])
            }
                ;
            const o = r.removeEventListener;
            r.removeEventListener = function (e, n) {
                if (e !== t || !this._eventMap || !this._eventMap[n])
                    return o.apply(this, arguments);
                const r = this._eventMap[n];
                return delete this._eventMap[n],
                    o.apply(this, [e, r])
            }
                ,
                Object.defineProperty(r, "on" + t, {
                    get() {
                        return this["_on" + t]
                    },
                    set(e) {
                        this["_on" + t] && (this.removeEventListener(t, this["_on" + t]),
                            delete this["_on" + t]),
                            e && this.addEventListener(t, this["_on" + t] = e)
                    },
                    enumerable: !0,
                    configurable: !0
                })
        }
        function S(e) {
            return "boolean" != typeof e ? new Error("Argument type: " + typeof e + ". Please use a boolean.") : (h = e,
                e ? "adapter.js logging disabled" : "adapter.js logging enabled")
        }
        function _(e) {
            return "boolean" != typeof e ? new Error("Argument type: " + typeof e + ". Please use a boolean.") : (m = !e,
                "adapter.js deprecation warnings " + (e ? "disabled" : "enabled"))
        }
        function T() {
            if ("object" == typeof window) {
                if (h)
                    return;
                "undefined" != typeof console && "function" == typeof console.log && console.log.apply(console, arguments)
            }
        }
        function E(e, t) {
            m && console.warn(e + " is deprecated, please use " + t + " instead.")
        }
        function y(e) {
            const { navigator: t } = e
                , n = {
                    browser: null,
                    version: null
                };
            if (void 0 === e || !e.navigator)
                return n.browser = "Not a browser.",
                    n;
            if (t.mozGetUserMedia)
                n.browser = "firefox",
                    n.version = g(t.userAgent, /Firefox\/(\d+)\./, 1);
            else if (t.webkitGetUserMedia || !1 === e.isSecureContext && e.webkitRTCPeerConnection && !e.RTCIceGatherer)
                n.browser = "chrome",
                    n.version = g(t.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
            else if (t.mediaDevices && t.userAgent.match(/Edge\/(\d+).(\d+)$/))
                n.browser = "edge",
                    n.version = g(t.userAgent, /Edge\/(\d+).(\d+)$/, 2);
            else {
                if (!e.RTCPeerConnection || !t.userAgent.match(/AppleWebKit\/(\d+)\./))
                    return n.browser = "Not a supported browser.",
                        n;
                n.browser = "safari",
                    n.version = g(t.userAgent, /AppleWebKit\/(\d+)\./, 1),
                    n.supportsUnifiedPlan = e.RTCRtpTransceiver && "currentDirection" in e.RTCRtpTransceiver.prototype
            }
            return n
        }
        function R(e) {
            return "[object Object]" === Object.prototype.toString.call(e)
        }
        function I(e) {
            return R(e) ? Object.keys(e).reduce((function (t, n) {
                const r = R(e[n])
                    , i = r ? I(e[n]) : e[n]
                    , o = r && !Object.keys(i).length;
                return void 0 === i || o ? t : Object.assign(t, {
                    [n]: i
                })
            }
            ), {}) : e
        }
        function k(e, t, n) {
            const r = n ? "outbound-rtp" : "inbound-rtp"
                , i = new Map;
            if (null === t)
                return i;
            const o = [];
            return e.forEach(e => {
                "track" === e.type && e.trackIdentifier === t.id && o.push(e)
            }
            ),
                o.forEach(t => {
                    e.forEach(n => {
                        n.type === r && n.trackId === t.id && function e(t, n, r) {
                            n && !r.has(n.id) && (r.set(n.id, n),
                                Object.keys(n).forEach(i => {
                                    i.endsWith("Id") ? e(t, t.get(n[i]), r) : i.endsWith("Ids") && n[i].forEach(n => {
                                        e(t, t.get(n), r)
                                    }
                                    )
                                }
                                ))
                        }(e, n, i)
                    }
                    )
                }
                ),
                i
        }
        const O = T;
        function A(e) {
            const t = e && e.navigator;
            if (!t.mediaDevices)
                return;
            const n = y(e)
                , r = function (e) {
                    if ("object" != typeof e || e.mandatory || e.optional)
                        return e;
                    const t = {};
                    return Object.keys(e).forEach(n => {
                        if ("require" === n || "advanced" === n || "mediaSource" === n)
                            return;
                        const r = "object" == typeof e[n] ? e[n] : {
                            ideal: e[n]
                        };
                        void 0 !== r.exact && "number" == typeof r.exact && (r.min = r.max = r.exact);
                        const i = function (e, t) {
                            return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t
                        };
                        if (void 0 !== r.ideal) {
                            t.optional = t.optional || [];
                            let e = {};
                            "number" == typeof r.ideal ? (e[i("min", n)] = r.ideal,
                                t.optional.push(e),
                                e = {},
                                e[i("max", n)] = r.ideal,
                                t.optional.push(e)) : (e[i("", n)] = r.ideal,
                                    t.optional.push(e))
                        }
                        void 0 !== r.exact && "number" != typeof r.exact ? (t.mandatory = t.mandatory || {},
                            t.mandatory[i("", n)] = r.exact) : ["min", "max"].forEach(e => {
                                void 0 !== r[e] && (t.mandatory = t.mandatory || {},
                                    t.mandatory[i(e, n)] = r[e])
                            }
                            )
                    }
                    ),
                        e.advanced && (t.optional = (t.optional || []).concat(e.advanced)),
                        t
                }
                , i = function (e, i) {
                    if (n.version >= 61)
                        return i(e);
                    if ((e = JSON.parse(JSON.stringify(e))) && "object" == typeof e.audio) {
                        const t = function (e, t, n) {
                            t in e && !(n in e) && (e[n] = e[t],
                                delete e[t])
                        };
                        t((e = JSON.parse(JSON.stringify(e))).audio, "autoGainControl", "googAutoGainControl"),
                            t(e.audio, "noiseSuppression", "googNoiseSuppression"),
                            e.audio = r(e.audio)
                    }
                    if (e && "object" == typeof e.video) {
                        let o = e.video.facingMode;
                        o = o && ("object" == typeof o ? o : {
                            ideal: o
                        });
                        const a = n.version < 66;
                        if (o && ("user" === o.exact || "environment" === o.exact || "user" === o.ideal || "environment" === o.ideal) && (!t.mediaDevices.getSupportedConstraints || !t.mediaDevices.getSupportedConstraints().facingMode || a)) {
                            let n;
                            if (delete e.video.facingMode,
                                "environment" === o.exact || "environment" === o.ideal ? n = ["back", "rear"] : "user" !== o.exact && "user" !== o.ideal || (n = ["front"]),
                                n)
                                return t.mediaDevices.enumerateDevices().then(t => {
                                    let a = (t = t.filter(e => "videoinput" === e.kind)).find(e => n.some(t => e.label.toLowerCase().includes(t)));
                                    return !a && t.length && n.includes("back") && (a = t[t.length - 1]),
                                        a && (e.video.deviceId = o.exact ? {
                                            exact: a.deviceId
                                        } : {
                                            ideal: a.deviceId
                                        }),
                                        e.video = r(e.video),
                                        O("chrome: " + JSON.stringify(e)),
                                        i(e)
                                }
                                )
                        }
                        e.video = r(e.video)
                    }
                    return O("chrome: " + JSON.stringify(e)),
                        i(e)
                }
                , o = function (e) {
                    return n.version >= 64 ? e : {
                        name: {
                            PermissionDeniedError: "NotAllowedError",
                            PermissionDismissedError: "NotAllowedError",
                            InvalidStateError: "NotAllowedError",
                            DevicesNotFoundError: "NotFoundError",
                            ConstraintNotSatisfiedError: "OverconstrainedError",
                            TrackStartError: "NotReadableError",
                            MediaDeviceFailedDueToShutdown: "NotAllowedError",
                            MediaDeviceKillSwitchOn: "NotAllowedError",
                            TabCaptureError: "AbortError",
                            ScreenCaptureError: "AbortError",
                            DeviceCaptureError: "AbortError"
                        }[e.name] || e.name,
                        message: e.message,
                        constraint: e.constraint || e.constraintName,
                        toString() {
                            return this.name + (this.message && ": ") + this.message
                        }
                    }
                };
            if (t.getUserMedia = function (e, n, r) {
                i(e, e => {
                    t.webkitGetUserMedia(e, n, e => {
                        r && r(o(e))
                    }
                    )
                }
                )
            }
                .bind(t),
                t.mediaDevices.getUserMedia) {
                const e = t.mediaDevices.getUserMedia.bind(t.mediaDevices);
                t.mediaDevices.getUserMedia = function (t) {
                    return i(t, t => e(t).then(e => {
                        if (t.audio && !e.getAudioTracks().length || t.video && !e.getVideoTracks().length)
                            throw e.getTracks().forEach(e => {
                                e.stop()
                            }
                            ),
                            new DOMException("", "NotFoundError");
                        return e
                    }
                        , e => Promise.reject(o(e))))
                }
            }
        }
        function b(e, t) {
            e.navigator.mediaDevices && "getDisplayMedia" in e.navigator.mediaDevices || e.navigator.mediaDevices && ("function" == typeof t ? e.navigator.mediaDevices.getDisplayMedia = function (n) {
                return t(n).then(t => {
                    const r = n.video && n.video.width
                        , i = n.video && n.video.height
                        , o = n.video && n.video.frameRate;
                    return n.video = {
                        mandatory: {
                            chromeMediaSource: "desktop",
                            chromeMediaSourceId: t,
                            maxFrameRate: o || 3
                        }
                    },
                        r && (n.video.mandatory.maxWidth = r),
                        i && (n.video.mandatory.maxHeight = i),
                        e.navigator.mediaDevices.getUserMedia(n)
                }
                )
            }
                : console.error("shimGetDisplayMedia: getSourceId argument is not a function"))
        }
        function M(e) {
            e.MediaStream = e.MediaStream || e.webkitMediaStream
        }
        function P(e) {
            if ("object" == typeof e && e.RTCPeerConnection && !("ontrack" in e.RTCPeerConnection.prototype)) {
                Object.defineProperty(e.RTCPeerConnection.prototype, "ontrack", {
                    get() {
                        return this._ontrack
                    },
                    set(e) {
                        this._ontrack && this.removeEventListener("track", this._ontrack),
                            this.addEventListener("track", this._ontrack = e)
                    },
                    enumerable: !0,
                    configurable: !0
                });
                const t = e.RTCPeerConnection.prototype.setRemoteDescription;
                e.RTCPeerConnection.prototype.setRemoteDescription = function () {
                    return this._ontrackpoly || (this._ontrackpoly = t => {
                        t.stream.addEventListener("addtrack", n => {
                            let r;
                            r = e.RTCPeerConnection.prototype.getReceivers ? this.getReceivers().find(e => e.track && e.track.id === n.track.id) : {
                                track: n.track
                            };
                            const i = new Event("track");
                            i.track = n.track,
                                i.receiver = r,
                                i.transceiver = {
                                    receiver: r
                                },
                                i.streams = [t.stream],
                                this.dispatchEvent(i)
                        }
                        ),
                            t.stream.getTracks().forEach(n => {
                                let r;
                                r = e.RTCPeerConnection.prototype.getReceivers ? this.getReceivers().find(e => e.track && e.track.id === n.id) : {
                                    track: n
                                };
                                const i = new Event("track");
                                i.track = n,
                                    i.receiver = r,
                                    i.transceiver = {
                                        receiver: r
                                    },
                                    i.streams = [t.stream],
                                    this.dispatchEvent(i)
                            }
                            )
                    }
                        ,
                        this.addEventListener("addstream", this._ontrackpoly)),
                        t.apply(this, arguments)
                }
            } else
                C(e, "track", e => (e.transceiver || Object.defineProperty(e, "transceiver", {
                    value: {
                        receiver: e.receiver
                    }
                }),
                    e))
        }
        function w(e) {
            if ("object" == typeof e && e.RTCPeerConnection && !("getSenders" in e.RTCPeerConnection.prototype) && "createDTMFSender" in e.RTCPeerConnection.prototype) {
                const t = function (e, t) {
                    return {
                        track: t,
                        get dtmf() {
                            return void 0 === this._dtmf && ("audio" === t.kind ? this._dtmf = e.createDTMFSender(t) : this._dtmf = null),
                                this._dtmf
                        },
                        _pc: e
                    }
                };
                if (!e.RTCPeerConnection.prototype.getSenders) {
                    e.RTCPeerConnection.prototype.getSenders = function () {
                        return this._senders = this._senders || [],
                            this._senders.slice()
                    }
                        ;
                    const n = e.RTCPeerConnection.prototype.addTrack;
                    e.RTCPeerConnection.prototype.addTrack = function (e, r) {
                        let i = n.apply(this, arguments);
                        return i || (i = t(this, e),
                            this._senders.push(i)),
                            i
                    }
                        ;
                    const r = e.RTCPeerConnection.prototype.removeTrack;
                    e.RTCPeerConnection.prototype.removeTrack = function (e) {
                        r.apply(this, arguments);
                        const t = this._senders.indexOf(e);
                        -1 !== t && this._senders.splice(t, 1)
                    }
                }
                const n = e.RTCPeerConnection.prototype.addStream;
                e.RTCPeerConnection.prototype.addStream = function (e) {
                    this._senders = this._senders || [],
                        n.apply(this, [e]),
                        e.getTracks().forEach(e => {
                            this._senders.push(t(this, e))
                        }
                        )
                }
                    ;
                const r = e.RTCPeerConnection.prototype.removeStream;
                e.RTCPeerConnection.prototype.removeStream = function (e) {
                    this._senders = this._senders || [],
                        r.apply(this, [e]),
                        e.getTracks().forEach(e => {
                            const t = this._senders.find(t => t.track === e);
                            t && this._senders.splice(this._senders.indexOf(t), 1)
                        }
                        )
                }
            } else if ("object" == typeof e && e.RTCPeerConnection && "getSenders" in e.RTCPeerConnection.prototype && "createDTMFSender" in e.RTCPeerConnection.prototype && e.RTCRtpSender && !("dtmf" in e.RTCRtpSender.prototype)) {
                const t = e.RTCPeerConnection.prototype.getSenders;
                e.RTCPeerConnection.prototype.getSenders = function () {
                    const e = t.apply(this, []);
                    return e.forEach(e => e._pc = this),
                        e
                }
                    ,
                    Object.defineProperty(e.RTCRtpSender.prototype, "dtmf", {
                        get() {
                            return void 0 === this._dtmf && ("audio" === this.track.kind ? this._dtmf = this._pc.createDTMFSender(this.track) : this._dtmf = null),
                                this._dtmf
                        }
                    })
            }
        }
        function D(e) {
            if (!e.RTCPeerConnection)
                return;
            const t = e.RTCPeerConnection.prototype.getStats;
            e.RTCPeerConnection.prototype.getStats = function () {
                const [e, n, r] = arguments;
                if (arguments.length > 0 && "function" == typeof e)
                    return t.apply(this, arguments);
                if (0 === t.length && (0 === arguments.length || "function" != typeof e))
                    return t.apply(this, []);
                const i = function (e) {
                    const t = {};
                    return e.result().forEach(e => {
                        const n = {
                            id: e.id,
                            timestamp: e.timestamp,
                            type: {
                                localcandidate: "local-candidate",
                                remotecandidate: "remote-candidate"
                            }[e.type] || e.type
                        };
                        e.names().forEach(t => {
                            n[t] = e.stat(t)
                        }
                        ),
                            t[n.id] = n
                    }
                    ),
                        t
                }
                    , o = function (e) {
                        return new Map(Object.keys(e).map(t => [t, e[t]]))
                    };
                if (arguments.length >= 2) {
                    const r = function (e) {
                        n(o(i(e)))
                    };
                    return t.apply(this, [r, e])
                }
                return new Promise((e, n) => {
                    t.apply(this, [function (t) {
                        e(o(i(t)))
                    }
                        , n])
                }
                ).then(n, r)
            }
        }
        function N(e) {
            if (!("object" == typeof e && e.RTCPeerConnection && e.RTCRtpSender && e.RTCRtpReceiver))
                return;
            if (!("getStats" in e.RTCRtpSender.prototype)) {
                const t = e.RTCPeerConnection.prototype.getSenders;
                t && (e.RTCPeerConnection.prototype.getSenders = function () {
                    const e = t.apply(this, []);
                    return e.forEach(e => e._pc = this),
                        e
                }
                );
                const n = e.RTCPeerConnection.prototype.addTrack;
                n && (e.RTCPeerConnection.prototype.addTrack = function () {
                    const e = n.apply(this, arguments);
                    return e._pc = this,
                        e
                }
                ),
                    e.RTCRtpSender.prototype.getStats = function () {
                        const e = this;
                        return this._pc.getStats().then(t => k(t, e.track, !0))
                    }
            }
            if (!("getStats" in e.RTCRtpReceiver.prototype)) {
                const t = e.RTCPeerConnection.prototype.getReceivers;
                t && (e.RTCPeerConnection.prototype.getReceivers = function () {
                    const e = t.apply(this, []);
                    return e.forEach(e => e._pc = this),
                        e
                }
                ),
                    C(e, "track", e => (e.receiver._pc = e.srcElement,
                        e)),
                    e.RTCRtpReceiver.prototype.getStats = function () {
                        const e = this;
                        return this._pc.getStats().then(t => k(t, e.track, !1))
                    }
            }
            if (!("getStats" in e.RTCRtpSender.prototype) || !("getStats" in e.RTCRtpReceiver.prototype))
                return;
            const t = e.RTCPeerConnection.prototype.getStats;
            e.RTCPeerConnection.prototype.getStats = function () {
                if (arguments.length > 0 && arguments[0] instanceof e.MediaStreamTrack) {
                    const e = arguments[0];
                    let t, n, r;
                    return this.getSenders().forEach(n => {
                        n.track === e && (t ? r = !0 : t = n)
                    }
                    ),
                        this.getReceivers().forEach(t => (t.track === e && (n ? r = !0 : n = t),
                            t.track === e)),
                        r || t && n ? Promise.reject(new DOMException("There are more than one sender or receiver for the track.", "InvalidAccessError")) : t ? t.getStats() : n ? n.getStats() : Promise.reject(new DOMException("There is no sender or receiver for the track.", "InvalidAccessError"))
                }
                return t.apply(this, arguments)
            }
        }
        function L(e) {
            e.RTCPeerConnection.prototype.getLocalStreams = function () {
                return this._shimmedLocalStreams = this._shimmedLocalStreams || {},
                    Object.keys(this._shimmedLocalStreams).map(e => this._shimmedLocalStreams[e][0])
            }
                ;
            const t = e.RTCPeerConnection.prototype.addTrack;
            e.RTCPeerConnection.prototype.addTrack = function (e, n) {
                if (!n)
                    return t.apply(this, arguments);
                this._shimmedLocalStreams = this._shimmedLocalStreams || {};
                const r = t.apply(this, arguments);
                return this._shimmedLocalStreams[n.id] ? -1 === this._shimmedLocalStreams[n.id].indexOf(r) && this._shimmedLocalStreams[n.id].push(r) : this._shimmedLocalStreams[n.id] = [n, r],
                    r
            }
                ;
            const n = e.RTCPeerConnection.prototype.addStream;
            e.RTCPeerConnection.prototype.addStream = function (e) {
                this._shimmedLocalStreams = this._shimmedLocalStreams || {},
                    e.getTracks().forEach(e => {
                        if (this.getSenders().find(t => t.track === e))
                            throw new DOMException("Track already exists.", "InvalidAccessError")
                    }
                    );
                const t = this.getSenders();
                n.apply(this, arguments);
                const r = this.getSenders().filter(e => -1 === t.indexOf(e));
                this._shimmedLocalStreams[e.id] = [e].concat(r)
            }
                ;
            const r = e.RTCPeerConnection.prototype.removeStream;
            e.RTCPeerConnection.prototype.removeStream = function (e) {
                return this._shimmedLocalStreams = this._shimmedLocalStreams || {},
                    delete this._shimmedLocalStreams[e.id],
                    r.apply(this, arguments)
            }
                ;
            const i = e.RTCPeerConnection.prototype.removeTrack;
            e.RTCPeerConnection.prototype.removeTrack = function (e) {
                return this._shimmedLocalStreams = this._shimmedLocalStreams || {},
                    e && Object.keys(this._shimmedLocalStreams).forEach(t => {
                        const n = this._shimmedLocalStreams[t].indexOf(e);
                        -1 !== n && this._shimmedLocalStreams[t].splice(n, 1),
                            1 === this._shimmedLocalStreams[t].length && delete this._shimmedLocalStreams[t]
                    }
                    ),
                    i.apply(this, arguments)
            }
        }
        function F(e) {
            if (!e.RTCPeerConnection)
                return;
            const t = y(e);
            if (e.RTCPeerConnection.prototype.addTrack && t.version >= 65)
                return L(e);
            const n = e.RTCPeerConnection.prototype.getLocalStreams;
            e.RTCPeerConnection.prototype.getLocalStreams = function () {
                const e = n.apply(this);
                return this._reverseStreams = this._reverseStreams || {},
                    e.map(e => this._reverseStreams[e.id])
            }
                ;
            const r = e.RTCPeerConnection.prototype.addStream;
            e.RTCPeerConnection.prototype.addStream = function (t) {
                if (this._streams = this._streams || {},
                    this._reverseStreams = this._reverseStreams || {},
                    t.getTracks().forEach(e => {
                        if (this.getSenders().find(t => t.track === e))
                            throw new DOMException("Track already exists.", "InvalidAccessError")
                    }
                    ),
                    !this._reverseStreams[t.id]) {
                    const n = new e.MediaStream(t.getTracks());
                    this._streams[t.id] = n,
                        this._reverseStreams[n.id] = t,
                        t = n
                }
                r.apply(this, [t])
            }
                ;
            const i = e.RTCPeerConnection.prototype.removeStream;
            function o(e, t) {
                let n = t.sdp;
                return Object.keys(e._reverseStreams || []).forEach(t => {
                    const r = e._reverseStreams[t]
                        , i = e._streams[r.id];
                    n = n.replace(new RegExp(i.id, "g"), r.id)
                }
                ),
                    new RTCSessionDescription({
                        type: t.type,
                        sdp: n
                    })
            }
            function a(e, t) {
                let n = t.sdp;
                return Object.keys(e._reverseStreams || []).forEach(t => {
                    const r = e._reverseStreams[t]
                        , i = e._streams[r.id];
                    n = n.replace(new RegExp(r.id, "g"), i.id)
                }
                ),
                    new RTCSessionDescription({
                        type: t.type,
                        sdp: n
                    })
            }
            e.RTCPeerConnection.prototype.removeStream = function (e) {
                this._streams = this._streams || {},
                    this._reverseStreams = this._reverseStreams || {},
                    i.apply(this, [this._streams[e.id] || e]),
                    delete this._reverseStreams[this._streams[e.id] ? this._streams[e.id].id : e.id],
                    delete this._streams[e.id]
            }
                ,
                e.RTCPeerConnection.prototype.addTrack = function (t, n) {
                    if ("closed" === this.signalingState)
                        throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
                    const r = [].slice.call(arguments, 1);
                    if (1 !== r.length || !r[0].getTracks().find(e => e === t))
                        throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
                    const i = this.getSenders().find(e => e.track === t);
                    if (i)
                        throw new DOMException("Track already exists.", "InvalidAccessError");
                    this._streams = this._streams || {},
                        this._reverseStreams = this._reverseStreams || {};
                    const o = this._streams[n.id];
                    if (o)
                        o.addTrack(t),
                            Promise.resolve().then(() => {
                                this.dispatchEvent(new Event("negotiationneeded"))
                            }
                            );
                    else {
                        const r = new e.MediaStream([t]);
                        this._streams[n.id] = r,
                            this._reverseStreams[r.id] = n,
                            this.addStream(r)
                    }
                    return this.getSenders().find(e => e.track === t)
                }
                ,
                ["createOffer", "createAnswer"].forEach((function (t) {
                    const n = e.RTCPeerConnection.prototype[t]
                        , r = {
                            [t]() {
                                const e = arguments;
                                return arguments.length && "function" == typeof arguments[0] ? n.apply(this, [t => {
                                    const n = o(this, t);
                                    e[0].apply(null, [n])
                                }
                                    , t => {
                                        e[1] && e[1].apply(null, t)
                                    }
                                    , arguments[2]]) : n.apply(this, arguments).then(e => o(this, e))
                            }
                        };
                    e.RTCPeerConnection.prototype[t] = r[t]
                }
                ));
            const s = e.RTCPeerConnection.prototype.setLocalDescription;
            e.RTCPeerConnection.prototype.setLocalDescription = function () {
                return arguments.length && arguments[0].type ? (arguments[0] = a(this, arguments[0]),
                    s.apply(this, arguments)) : s.apply(this, arguments)
            }
                ;
            const c = Object.getOwnPropertyDescriptor(e.RTCPeerConnection.prototype, "localDescription");
            Object.defineProperty(e.RTCPeerConnection.prototype, "localDescription", {
                get() {
                    const e = c.get.apply(this);
                    return "" === e.type ? e : o(this, e)
                }
            }),
                e.RTCPeerConnection.prototype.removeTrack = function (e) {
                    if ("closed" === this.signalingState)
                        throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
                    if (!e._pc)
                        throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
                    if (!(e._pc === this))
                        throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
                    let t;
                    this._streams = this._streams || {},
                        Object.keys(this._streams).forEach(n => {
                            this._streams[n].getTracks().find(t => e.track === t) && (t = this._streams[n])
                        }
                        ),
                        t && (1 === t.getTracks().length ? this.removeStream(this._reverseStreams[t.id]) : t.removeTrack(e.track),
                            this.dispatchEvent(new Event("negotiationneeded")))
                }
        }
        function V(e) {
            const t = y(e);
            if (!e.RTCPeerConnection && e.webkitRTCPeerConnection && (e.RTCPeerConnection = e.webkitRTCPeerConnection),
                !e.RTCPeerConnection)
                return;
            const n = 0 === e.RTCPeerConnection.prototype.addIceCandidate.length;
            t.version < 53 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach((function (t) {
                const n = e.RTCPeerConnection.prototype[t]
                    , r = {
                        [t]() {
                            return arguments[0] = new ("addIceCandidate" === t ? e.RTCIceCandidate : e.RTCSessionDescription)(arguments[0]),
                                n.apply(this, arguments)
                        }
                    };
                e.RTCPeerConnection.prototype[t] = r[t]
            }
            ));
            const r = e.RTCPeerConnection.prototype.addIceCandidate;
            e.RTCPeerConnection.prototype.addIceCandidate = function () {
                return n || arguments[0] ? t.version < 78 && arguments[0] && "" === arguments[0].candidate ? Promise.resolve() : r.apply(this, arguments) : (arguments[1] && arguments[1].apply(null),
                    Promise.resolve())
            }
        }
        function x(e) {
            C(e, "negotiationneeded", e => {
                if ("stable" === e.target.signalingState)
                    return e
            }
            )
        }
        var G = n(1)
            , U = n.n(G);
        function j(e) {
            const t = e && e.navigator
                , n = t.mediaDevices.getUserMedia.bind(t.mediaDevices);
            t.mediaDevices.getUserMedia = function (e) {
                return n(e).catch(e => Promise.reject(function (e) {
                    return {
                        name: {
                            PermissionDeniedError: "NotAllowedError"
                        }[e.name] || e.name,
                        message: e.message,
                        constraint: e.constraint,
                        toString() {
                            return this.name
                        }
                    }
                }(e)))
            }
        }
        function H(e) {
            "getDisplayMedia" in e.navigator && e.navigator.mediaDevices && (e.navigator.mediaDevices && "getDisplayMedia" in e.navigator.mediaDevices || (e.navigator.mediaDevices.getDisplayMedia = e.navigator.getDisplayMedia.bind(e.navigator)))
        }
        function B(e) {
            const t = y(e);
            if (e.RTCIceGatherer && (e.RTCIceCandidate || (e.RTCIceCandidate = function (e) {
                return e
            }
            ),
                e.RTCSessionDescription || (e.RTCSessionDescription = function (e) {
                    return e
                }
                ),
                t.version < 15025)) {
                const t = Object.getOwnPropertyDescriptor(e.MediaStreamTrack.prototype, "enabled");
                Object.defineProperty(e.MediaStreamTrack.prototype, "enabled", {
                    set(e) {
                        t.set.call(this, e);
                        const n = new Event("enabled");
                        n.enabled = e,
                            this.dispatchEvent(n)
                    }
                })
            }
            e.RTCRtpSender && !("dtmf" in e.RTCRtpSender.prototype) && Object.defineProperty(e.RTCRtpSender.prototype, "dtmf", {
                get() {
                    return void 0 === this._dtmf && ("audio" === this.track.kind ? this._dtmf = new e.RTCDtmfSender(this) : "video" === this.track.kind && (this._dtmf = null)),
                        this._dtmf
                }
            }),
                e.RTCDtmfSender && !e.RTCDTMFSender && (e.RTCDTMFSender = e.RTCDtmfSender);
            const n = U()(e, t.version);
            e.RTCPeerConnection = function (e) {
                return e && e.iceServers && (e.iceServers = function (e, t) {
                    let n = !1;
                    return (e = JSON.parse(JSON.stringify(e))).filter(e => {
                        if (e && (e.urls || e.url)) {
                            var t = e.urls || e.url;
                            e.url && !e.urls && E("RTCIceServer.url", "RTCIceServer.urls");
                            const r = "string" == typeof t;
                            return r && (t = [t]),
                                t = t.filter(e => {
                                    if (0 === e.indexOf("stun:"))
                                        return !1;
                                    const t = e.startsWith("turn") && !e.startsWith("turn:[") && e.includes("transport=udp");
                                    return t && !n ? (n = !0,
                                        !0) : t && !n
                                }
                                ),
                                delete e.url,
                                e.urls = r ? t[0] : t,
                                !!t.length
                        }
                    }
                    )
                }(e.iceServers, t.version),
                    T("ICE servers after filtering:", e.iceServers)),
                    new n(e)
            }
                ,
                e.RTCPeerConnection.prototype = n.prototype
        }
        function q(e) {
            e.RTCRtpSender && !("replaceTrack" in e.RTCRtpSender.prototype) && (e.RTCRtpSender.prototype.replaceTrack = e.RTCRtpSender.prototype.setTrack)
        }
        function K(e) {
            const t = y(e)
                , n = e && e.navigator
                , r = e && e.MediaStreamTrack;
            if (n.getUserMedia = function (e, t, r) {
                E("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia"),
                    n.mediaDevices.getUserMedia(e).then(t, r)
            }
                ,
                !(t.version > 55 && "autoGainControl" in n.mediaDevices.getSupportedConstraints())) {
                const e = function (e, t, n) {
                    t in e && !(n in e) && (e[n] = e[t],
                        delete e[t])
                }
                    , t = n.mediaDevices.getUserMedia.bind(n.mediaDevices);
                if (n.mediaDevices.getUserMedia = function (n) {
                    return "object" == typeof n && "object" == typeof n.audio && (n = JSON.parse(JSON.stringify(n)),
                        e(n.audio, "autoGainControl", "mozAutoGainControl"),
                        e(n.audio, "noiseSuppression", "mozNoiseSuppression")),
                        t(n)
                }
                    ,
                    r && r.prototype.getSettings) {
                    const t = r.prototype.getSettings;
                    r.prototype.getSettings = function () {
                        const n = t.apply(this, arguments);
                        return e(n, "mozAutoGainControl", "autoGainControl"),
                            e(n, "mozNoiseSuppression", "noiseSuppression"),
                            n
                    }
                }
                if (r && r.prototype.applyConstraints) {
                    const t = r.prototype.applyConstraints;
                    r.prototype.applyConstraints = function (n) {
                        return "audio" === this.kind && "object" == typeof n && (n = JSON.parse(JSON.stringify(n)),
                            e(n, "autoGainControl", "mozAutoGainControl"),
                            e(n, "noiseSuppression", "mozNoiseSuppression")),
                            t.apply(this, [n])
                    }
                }
            }
        }
        function J(e, t) {
            e.navigator.mediaDevices && "getDisplayMedia" in e.navigator.mediaDevices || e.navigator.mediaDevices && (e.navigator.mediaDevices.getDisplayMedia = function (n) {
                if (!n || !n.video) {
                    const e = new DOMException("getDisplayMedia without video constraints is undefined");
                    return e.name = "NotFoundError",
                        e.code = 8,
                        Promise.reject(e)
                }
                return !0 === n.video ? n.video = {
                    mediaSource: t
                } : n.video.mediaSource = t,
                    e.navigator.mediaDevices.getUserMedia(n)
            }
            )
        }
        function W(e) {
            "object" == typeof e && e.RTCTrackEvent && "receiver" in e.RTCTrackEvent.prototype && !("transceiver" in e.RTCTrackEvent.prototype) && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
                get() {
                    return {
                        receiver: this.receiver
                    }
                }
            })
        }
        function z(e) {
            const t = y(e);
            if ("object" != typeof e || !e.RTCPeerConnection && !e.mozRTCPeerConnection)
                return;
            if (!e.RTCPeerConnection && e.mozRTCPeerConnection && (e.RTCPeerConnection = e.mozRTCPeerConnection),
                t.version < 53 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach((function (t) {
                    const n = e.RTCPeerConnection.prototype[t]
                        , r = {
                            [t]() {
                                return arguments[0] = new ("addIceCandidate" === t ? e.RTCIceCandidate : e.RTCSessionDescription)(arguments[0]),
                                    n.apply(this, arguments)
                            }
                        };
                    e.RTCPeerConnection.prototype[t] = r[t]
                }
                )),
                t.version < 68) {
                const t = e.RTCPeerConnection.prototype.addIceCandidate;
                e.RTCPeerConnection.prototype.addIceCandidate = function () {
                    return arguments[0] ? arguments[0] && "" === arguments[0].candidate ? Promise.resolve() : t.apply(this, arguments) : (arguments[1] && arguments[1].apply(null),
                        Promise.resolve())
                }
            }
            const n = {
                inboundrtp: "inbound-rtp",
                outboundrtp: "outbound-rtp",
                candidatepair: "candidate-pair",
                localcandidate: "local-candidate",
                remotecandidate: "remote-candidate"
            }
                , r = e.RTCPeerConnection.prototype.getStats;
            e.RTCPeerConnection.prototype.getStats = function () {
                const [e, i, o] = arguments;
                return r.apply(this, [e || null]).then(e => {
                    if (t.version < 53 && !i)
                        try {
                            e.forEach(e => {
                                e.type = n[e.type] || e.type
                            }
                            )
                        } catch (t) {
                            if ("TypeError" !== t.name)
                                throw t;
                            e.forEach((t, r) => {
                                e.set(r, Object.assign({}, t, {
                                    type: n[t.type] || t.type
                                }))
                            }
                            )
                        }
                    return e
                }
                ).then(i, o)
            }
        }
        function Q(e) {
            if ("object" != typeof e || !e.RTCPeerConnection || !e.RTCRtpSender)
                return;
            if (e.RTCRtpSender && "getStats" in e.RTCRtpSender.prototype)
                return;
            const t = e.RTCPeerConnection.prototype.getSenders;
            t && (e.RTCPeerConnection.prototype.getSenders = function () {
                const e = t.apply(this, []);
                return e.forEach(e => e._pc = this),
                    e
            }
            );
            const n = e.RTCPeerConnection.prototype.addTrack;
            n && (e.RTCPeerConnection.prototype.addTrack = function () {
                const e = n.apply(this, arguments);
                return e._pc = this,
                    e
            }
            ),
                e.RTCRtpSender.prototype.getStats = function () {
                    return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map)
                }
        }
        function Y(e) {
            if ("object" != typeof e || !e.RTCPeerConnection || !e.RTCRtpSender)
                return;
            if (e.RTCRtpSender && "getStats" in e.RTCRtpReceiver.prototype)
                return;
            const t = e.RTCPeerConnection.prototype.getReceivers;
            t && (e.RTCPeerConnection.prototype.getReceivers = function () {
                const e = t.apply(this, []);
                return e.forEach(e => e._pc = this),
                    e
            }
            ),
                C(e, "track", e => (e.receiver._pc = e.srcElement,
                    e)),
                e.RTCRtpReceiver.prototype.getStats = function () {
                    return this._pc.getStats(this.track)
                }
        }
        function X(e) {
            e.RTCPeerConnection && !("removeStream" in e.RTCPeerConnection.prototype) && (e.RTCPeerConnection.prototype.removeStream = function (e) {
                E("removeStream", "removeTrack"),
                    this.getSenders().forEach(t => {
                        t.track && e.getTracks().includes(t.track) && this.removeTrack(t)
                    }
                    )
            }
            )
        }
        function $(e) {
            e.DataChannel && !e.RTCDataChannel && (e.RTCDataChannel = e.DataChannel)
        }
        function Z(e) {
            if ("object" != typeof e || !e.RTCPeerConnection)
                return;
            const t = e.RTCPeerConnection.prototype.addTransceiver;
            t && (e.RTCPeerConnection.prototype.addTransceiver = function () {
                this.setParametersPromises = [];
                const e = arguments[1]
                    , n = e && "sendEncodings" in e;
                n && e.sendEncodings.forEach(e => {
                    if ("rid" in e) {
                        if (!/^[a-z0-9]{0,16}$/i.test(e.rid))
                            throw new TypeError("Invalid RID value provided.")
                    }
                    if ("scaleResolutionDownBy" in e && !(parseFloat(e.scaleResolutionDownBy) >= 1))
                        throw new RangeError("scale_resolution_down_by must be >= 1.0");
                    if ("maxFramerate" in e && !(parseFloat(e.maxFramerate) >= 0))
                        throw new RangeError("max_framerate must be >= 0.0")
                }
                );
                const r = t.apply(this, arguments);
                if (n) {
                    const { sender: t } = r
                        , n = t.getParameters();
                    "encodings" in n || (n.encodings = e.sendEncodings,
                        this.setParametersPromises.push(t.setParameters(n).catch(() => { }
                        )))
                }
                return r
            }
            )
        }
        function ee(e) {
            if ("object" != typeof e || !e.RTCPeerConnection)
                return;
            const t = e.RTCPeerConnection.prototype.createOffer;
            e.RTCPeerConnection.prototype.createOffer = function () {
                return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(() => t.apply(this, arguments)).finally(() => {
                    this.setParametersPromises = []
                }
                ) : t.apply(this, arguments)
            }
        }
        function te(e) {
            if ("object" != typeof e || !e.RTCPeerConnection)
                return;
            const t = e.RTCPeerConnection.prototype.createAnswer;
            e.RTCPeerConnection.prototype.createAnswer = function () {
                return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(() => t.apply(this, arguments)).finally(() => {
                    this.setParametersPromises = []
                }
                ) : t.apply(this, arguments)
            }
        }
        function ne(e) {
            if ("object" == typeof e && e.RTCPeerConnection) {
                if ("getLocalStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getLocalStreams = function () {
                    return this._localStreams || (this._localStreams = []),
                        this._localStreams
                }
                ),
                    !("addStream" in e.RTCPeerConnection.prototype)) {
                    const t = e.RTCPeerConnection.prototype.addTrack;
                    e.RTCPeerConnection.prototype.addStream = function (e) {
                        this._localStreams || (this._localStreams = []),
                            this._localStreams.includes(e) || this._localStreams.push(e),
                            e.getAudioTracks().forEach(n => t.call(this, n, e)),
                            e.getVideoTracks().forEach(n => t.call(this, n, e))
                    }
                        ,
                        e.RTCPeerConnection.prototype.addTrack = function (e, ...n) {
                            return n && n.forEach(e => {
                                this._localStreams ? this._localStreams.includes(e) || this._localStreams.push(e) : this._localStreams = [e]
                            }
                            ),
                                t.apply(this, arguments)
                        }
                }
                "removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function (e) {
                    this._localStreams || (this._localStreams = []);
                    const t = this._localStreams.indexOf(e);
                    if (-1 === t)
                        return;
                    this._localStreams.splice(t, 1);
                    const n = e.getTracks();
                    this.getSenders().forEach(e => {
                        n.includes(e.track) && this.removeTrack(e)
                    }
                    )
                }
                )
            }
        }
        function re(e) {
            if ("object" == typeof e && e.RTCPeerConnection && ("getRemoteStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getRemoteStreams = function () {
                return this._remoteStreams ? this._remoteStreams : []
            }
            ),
                !("onaddstream" in e.RTCPeerConnection.prototype))) {
                Object.defineProperty(e.RTCPeerConnection.prototype, "onaddstream", {
                    get() {
                        return this._onaddstream
                    },
                    set(e) {
                        this._onaddstream && (this.removeEventListener("addstream", this._onaddstream),
                            this.removeEventListener("track", this._onaddstreampoly)),
                            this.addEventListener("addstream", this._onaddstream = e),
                            this.addEventListener("track", this._onaddstreampoly = e => {
                                e.streams.forEach(e => {
                                    if (this._remoteStreams || (this._remoteStreams = []),
                                        this._remoteStreams.includes(e))
                                        return;
                                    this._remoteStreams.push(e);
                                    const t = new Event("addstream");
                                    t.stream = e,
                                        this.dispatchEvent(t)
                                }
                                )
                            }
                            )
                    }
                });
                const t = e.RTCPeerConnection.prototype.setRemoteDescription;
                e.RTCPeerConnection.prototype.setRemoteDescription = function () {
                    const e = this;
                    return this._onaddstreampoly || this.addEventListener("track", this._onaddstreampoly = function (t) {
                        t.streams.forEach(t => {
                            if (e._remoteStreams || (e._remoteStreams = []),
                                e._remoteStreams.indexOf(t) >= 0)
                                return;
                            e._remoteStreams.push(t);
                            const n = new Event("addstream");
                            n.stream = t,
                                e.dispatchEvent(n)
                        }
                        )
                    }
                    ),
                        t.apply(e, arguments)
                }
            }
        }
        function ie(e) {
            if ("object" != typeof e || !e.RTCPeerConnection)
                return;
            const t = e.RTCPeerConnection.prototype
                , n = t.createOffer
                , r = t.createAnswer
                , i = t.setLocalDescription
                , o = t.setRemoteDescription
                , a = t.addIceCandidate;
            t.createOffer = function (e, t) {
                const r = arguments.length >= 2 ? arguments[2] : arguments[0]
                    , i = n.apply(this, [r]);
                return t ? (i.then(e, t),
                    Promise.resolve()) : i
            }
                ,
                t.createAnswer = function (e, t) {
                    const n = arguments.length >= 2 ? arguments[2] : arguments[0]
                        , i = r.apply(this, [n]);
                    return t ? (i.then(e, t),
                        Promise.resolve()) : i
                }
                ;
            let s = function (e, t, n) {
                const r = i.apply(this, [e]);
                return n ? (r.then(t, n),
                    Promise.resolve()) : r
            };
            t.setLocalDescription = s,
                s = function (e, t, n) {
                    const r = o.apply(this, [e]);
                    return n ? (r.then(t, n),
                        Promise.resolve()) : r
                }
                ,
                t.setRemoteDescription = s,
                s = function (e, t, n) {
                    const r = a.apply(this, [e]);
                    return n ? (r.then(t, n),
                        Promise.resolve()) : r
                }
                ,
                t.addIceCandidate = s
        }
        function oe(e) {
            const t = e && e.navigator;
            if (t.mediaDevices && t.mediaDevices.getUserMedia) {
                const e = t.mediaDevices
                    , n = e.getUserMedia.bind(e);
                t.mediaDevices.getUserMedia = e => n(ae(e))
            }
            !t.getUserMedia && t.mediaDevices && t.mediaDevices.getUserMedia && (t.getUserMedia = function (e, n, r) {
                t.mediaDevices.getUserMedia(e).then(n, r)
            }
                .bind(t))
        }
        function ae(e) {
            return e && void 0 !== e.video ? Object.assign({}, e, {
                video: I(e.video)
            }) : e
        }
        function se(e) {
            const t = e.RTCPeerConnection;
            e.RTCPeerConnection = function (e, n) {
                if (e && e.iceServers) {
                    const t = [];
                    for (let n = 0; n < e.iceServers.length; n++) {
                        let r = e.iceServers[n];
                        !r.hasOwnProperty("urls") && r.hasOwnProperty("url") ? (E("RTCIceServer.url", "RTCIceServer.urls"),
                            r = JSON.parse(JSON.stringify(r)),
                            r.urls = r.url,
                            delete r.url,
                            t.push(r)) : t.push(e.iceServers[n])
                    }
                    e.iceServers = t
                }
                return new t(e, n)
            }
                ,
                e.RTCPeerConnection.prototype = t.prototype,
                "generateCertificate" in e.RTCPeerConnection && Object.defineProperty(e.RTCPeerConnection, "generateCertificate", {
                    get: () => t.generateCertificate
                })
        }
        function ce(e) {
            "object" == typeof e && e.RTCTrackEvent && "receiver" in e.RTCTrackEvent.prototype && !("transceiver" in e.RTCTrackEvent.prototype) && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
                get() {
                    return {
                        receiver: this.receiver
                    }
                }
            })
        }
        function le(e) {
            const t = e.RTCPeerConnection.prototype.createOffer;
            e.RTCPeerConnection.prototype.createOffer = function (e) {
                if (e) {
                    void 0 !== e.offerToReceiveAudio && (e.offerToReceiveAudio = !!e.offerToReceiveAudio);
                    const t = this.getTransceivers().find(e => "audio" === e.receiver.track.kind);
                    !1 === e.offerToReceiveAudio && t ? "sendrecv" === t.direction ? t.setDirection ? t.setDirection("sendonly") : t.direction = "sendonly" : "recvonly" === t.direction && (t.setDirection ? t.setDirection("inactive") : t.direction = "inactive") : !0 !== e.offerToReceiveAudio || t || this.addTransceiver("audio"),
                        void 0 !== e.offerToReceiveVideo && (e.offerToReceiveVideo = !!e.offerToReceiveVideo);
                    const n = this.getTransceivers().find(e => "video" === e.receiver.track.kind);
                    !1 === e.offerToReceiveVideo && n ? "sendrecv" === n.direction ? n.setDirection ? n.setDirection("sendonly") : n.direction = "sendonly" : "recvonly" === n.direction && (n.setDirection ? n.setDirection("inactive") : n.direction = "inactive") : !0 !== e.offerToReceiveVideo || n || this.addTransceiver("video")
                }
                return t.apply(this, arguments)
            }
        }
        var de = n(0)
            , ue = n.n(de);
        function pe(e) {
            if (!e.RTCIceCandidate || e.RTCIceCandidate && "foundation" in e.RTCIceCandidate.prototype)
                return;
            const t = e.RTCIceCandidate;
            e.RTCIceCandidate = function (e) {
                if ("object" == typeof e && e.candidate && 0 === e.candidate.indexOf("a=") && ((e = JSON.parse(JSON.stringify(e))).candidate = e.candidate.substr(2)),
                    e.candidate && e.candidate.length) {
                    const n = new t(e)
                        , r = ue.a.parseCandidate(e.candidate)
                        , i = Object.assign(n, r);
                    return i.toJSON = function () {
                        return {
                            candidate: i.candidate,
                            sdpMid: i.sdpMid,
                            sdpMLineIndex: i.sdpMLineIndex,
                            usernameFragment: i.usernameFragment
                        }
                    }
                        ,
                        i
                }
                return new t(e)
            }
                ,
                e.RTCIceCandidate.prototype = t.prototype,
                C(e, "icecandidate", t => (t.candidate && Object.defineProperty(t, "candidate", {
                    value: new e.RTCIceCandidate(t.candidate),
                    writable: "false"
                }),
                    t))
        }
        function ve(e) {
            if (!e.RTCPeerConnection)
                return;
            const t = y(e);
            "sctp" in e.RTCPeerConnection.prototype || Object.defineProperty(e.RTCPeerConnection.prototype, "sctp", {
                get() {
                    return void 0 === this._sctp ? null : this._sctp
                }
            });
            const n = function (e) {
                if (!e || !e.sdp)
                    return !1;
                const t = ue.a.splitSections(e.sdp);
                return t.shift(),
                    t.some(e => {
                        const t = ue.a.parseMLine(e);
                        return t && "application" === t.kind && -1 !== t.protocol.indexOf("SCTP")
                    }
                    )
            }
                , r = function (e) {
                    const t = e.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
                    if (null === t || t.length < 2)
                        return -1;
                    const n = parseInt(t[1], 10);
                    return n != n ? -1 : n
                }
                , i = function (e) {
                    let n = 65536;
                    return "firefox" === t.browser && (n = t.version < 57 ? -1 === e ? 16384 : 2147483637 : t.version < 60 ? 57 === t.version ? 65535 : 65536 : 2147483637),
                        n
                }
                , o = function (e, n) {
                    let r = 65536;
                    "firefox" === t.browser && 57 === t.version && (r = 65535);
                    const i = ue.a.matchPrefix(e.sdp, "a=max-message-size:");
                    return i.length > 0 ? r = parseInt(i[0].substr(19), 10) : "firefox" === t.browser && -1 !== n && (r = 2147483637),
                        r
                }
                , a = e.RTCPeerConnection.prototype.setRemoteDescription;
            e.RTCPeerConnection.prototype.setRemoteDescription = function () {
                if (this._sctp = null,
                    "chrome" === t.browser && t.version >= 76) {
                    const { sdpSemantics: e } = this.getConfiguration();
                    "plan-b" === e && Object.defineProperty(this, "sctp", {
                        get() {
                            return void 0 === this._sctp ? null : this._sctp
                        },
                        enumerable: !0,
                        configurable: !0
                    })
                }
                if (n(arguments[0])) {
                    const e = r(arguments[0])
                        , t = i(e)
                        , n = o(arguments[0], e);
                    let a;
                    a = 0 === t && 0 === n ? Number.POSITIVE_INFINITY : 0 === t || 0 === n ? Math.max(t, n) : Math.min(t, n);
                    const s = {};
                    Object.defineProperty(s, "maxMessageSize", {
                        get: () => a
                    }),
                        this._sctp = s
                }
                return a.apply(this, arguments)
            }
        }
        function fe(e) {
            if (!e.RTCPeerConnection || !("createDataChannel" in e.RTCPeerConnection.prototype))
                return;
            function t(e, t) {
                const n = e.send;
                e.send = function () {
                    const r = arguments[0]
                        , i = r.length || r.size || r.byteLength;
                    if ("open" === e.readyState && t.sctp && i > t.sctp.maxMessageSize)
                        throw new TypeError("Message too large (can send a maximum of " + t.sctp.maxMessageSize + " bytes)");
                    return n.apply(e, arguments)
                }
            }
            const n = e.RTCPeerConnection.prototype.createDataChannel;
            e.RTCPeerConnection.prototype.createDataChannel = function () {
                const e = n.apply(this, arguments);
                return t(e, this),
                    e
            }
                ,
                C(e, "datachannel", e => (t(e.channel, e.target),
                    e))
        }
        function he(e) {
            if (!e.RTCPeerConnection || "connectionState" in e.RTCPeerConnection.prototype)
                return;
            const t = e.RTCPeerConnection.prototype;
            Object.defineProperty(t, "connectionState", {
                get() {
                    return {
                        completed: "connected",
                        checking: "connecting"
                    }[this.iceConnectionState] || this.iceConnectionState
                },
                enumerable: !0,
                configurable: !0
            }),
                Object.defineProperty(t, "onconnectionstatechange", {
                    get() {
                        return this._onconnectionstatechange || null
                    },
                    set(e) {
                        this._onconnectionstatechange && (this.removeEventListener("connectionstatechange", this._onconnectionstatechange),
                            delete this._onconnectionstatechange),
                            e && this.addEventListener("connectionstatechange", this._onconnectionstatechange = e)
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                ["setLocalDescription", "setRemoteDescription"].forEach(e => {
                    const n = t[e];
                    t[e] = function () {
                        return this._connectionstatechangepoly || (this._connectionstatechangepoly = e => {
                            const t = e.target;
                            if (t._lastConnectionState !== t.connectionState) {
                                t._lastConnectionState = t.connectionState;
                                const n = new Event("connectionstatechange", e);
                                t.dispatchEvent(n)
                            }
                            return e
                        }
                            ,
                            this.addEventListener("iceconnectionstatechange", this._connectionstatechangepoly)),
                            n.apply(this, arguments)
                    }
                }
                )
        }
        function me(e) {
            if (!e.RTCPeerConnection)
                return;
            const t = y(e);
            if ("chrome" === t.browser && t.version >= 71)
                return;
            const n = e.RTCPeerConnection.prototype.setRemoteDescription;
            e.RTCPeerConnection.prototype.setRemoteDescription = function (e) {
                return e && e.sdp && -1 !== e.sdp.indexOf("\na=extmap-allow-mixed") && (e.sdp = e.sdp.split("\n").filter(e => "a=extmap-allow-mixed" !== e.trim()).join("\n")),
                    n.apply(this, arguments)
            }
        }
        !function ({ window: e } = {}, t = {
            shimChrome: !0,
            shimFirefox: !0,
            shimEdge: !0,
            shimSafari: !0
        }) {
            const n = T
                , c = y(e)
                , l = {
                    browserDetails: c,
                    commonShim: s,
                    extractVersion: g,
                    disableLog: S,
                    disableWarnings: _
                };
            switch (c.browser) {
                case "chrome":
                    if (!r || !V || !t.shimChrome)
                        return n("Chrome shim is not included in this adapter release."),
                            l;
                    n("adapter.js shimming chrome."),
                        l.browserShim = r,
                        A(e),
                        M(e),
                        V(e),
                        P(e),
                        F(e),
                        w(e),
                        D(e),
                        N(e),
                        x(e),
                        pe(e),
                        he(e),
                        ve(e),
                        fe(e),
                        me(e);
                    break;
                case "firefox":
                    if (!o || !z || !t.shimFirefox)
                        return n("Firefox shim is not included in this adapter release."),
                            l;
                    n("adapter.js shimming firefox."),
                        l.browserShim = o,
                        K(e),
                        z(e),
                        W(e),
                        X(e),
                        Q(e),
                        Y(e),
                        $(e),
                        Z(e),
                        ee(e),
                        te(e),
                        pe(e),
                        he(e),
                        ve(e),
                        fe(e);
                    break;
                case "edge":
                    if (!i || !B || !t.shimEdge)
                        return n("MS edge shim is not included in this adapter release."),
                            l;
                    n("adapter.js shimming edge."),
                        l.browserShim = i,
                        j(e),
                        H(e),
                        B(e),
                        q(e),
                        ve(e),
                        fe(e);
                    break;
                case "safari":
                    if (!a || !t.shimSafari)
                        return n("Safari shim is not included in this adapter release."),
                            l;
                    n("adapter.js shimming safari."),
                        l.browserShim = a,
                        se(e),
                        le(e),
                        ie(e),
                        ne(e),
                        re(e),
                        ce(e),
                        oe(e),
                        pe(e),
                        ve(e),
                        fe(e),
                        me(e);
                    break;
                default:
                    n("Unsupported browser!")
            }
        }({
            window: window
        });
        function ge(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        var Ce = function () {
            function e(t, n, r, i) {
                !function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                    this.client = t,
                    this.fromNumber = n,
                    this.toNumber = r,
                    this.custom = "",
                    this.customDataFromYourServer = "",
                    this.fromAlias = n,
                    this.toAlias = r,
                    this.fromInternal = !0,
                    this.answeredOnAnotherDevice = !1,
                    this.isVideoCall = i,
                    this.isIncomingCall = !1,
                    this.isAnswered = !1,
                    this.isOnHold = !1,
                    this.ended = !1,
                    this.callId = "",
                    this._iceServers = null,
                    this.toType = "",
                    this.muted = !1,
                    this.localVideoEnabled = i,
                    this._onMethods = new l,
                    this.client._stringeeCalls.push(this),
                    this.videoResolution = null,
                    this._pc = null,
                    this._localStream = null,
                    this._remoteStream = null,
                    this._localSdp = null,
                    this._remoteSdps = new l,
                    this._mapListCandidates = new l,
                    this._answeredDeviceId = null,
                    this._setRemoteSdpOk = !1,
                    this._mediaConnected = !1
            }
            var t, n, r;
            return t = e,
                (n = [{
                    key: "makeCall",
                    value: function (e) {
                        if (this.isIncomingCall)
                            console.log("could not make call, this is a incoming call");
                        else {
                            var t = this
                                , n = {
                                    fromNumber: this.fromNumber,
                                    toNumber: this.toNumber,
                                    video: this.isVideoCall,
                                    custom: t.custom
                                };
                            this.client._sendMessage(c.CALL_START, n, (function (n) {
                                var r = n.r
                                    , i = n.iceServers;
                                delete n.iceServers,
                                    0 === r ? (t.callId = n.callId,
                                        t._iceServers = i,
                                        t.toType = n.toType,
                                        t.customDataFromYourServer = n.customDataFromYourServer,
                                        t._initPeerConnection(!0, e, n)) : (t.ended = !0,
                                            e.call(t, n))
                            }
                            ))
                        }
                    }
                }, {
                    key: "answer",
                    value: function (e) {
                        var t = this;
                        if (this.isIncomingCall)
                            if (this.isAnswered)
                                console.log("Error: call has been answered");
                            else if (this.answeredOnAnotherDevice)
                                console.log("Error: call has been answered on other device");
                            else {
                                this.isAnswered = !0;
                                var n = {
                                    callId: this.callId,
                                    code: 200
                                };
                                this.client._sendMessage(c.CALL_STATE, n, (function (n) {
                                    e && e.call(t, {
                                        r: n.r
                                    })
                                }
                                )),
                                    t.fromInternal || t._onRemoteSDP(),
                                    t._checkAndAddCandidateFromQueue()
                            }
                        else
                            console.log("Error: could not answer call, this is a outgoing call")
                    }
                }, {
                    key: "reject",
                    value: function (e) {
                        var t = this;
                        if (this.isIncomingCall) {
                            t.ended = !0;
                            var n = {
                                callId: this.callId,
                                code: 486
                            };
                            this.client._sendMessage(c.CALL_STATE, n, (function (n) {
                                e && e.call(t, {
                                    r: n.r
                                })
                            }
                            )),
                                this._freeResource(),
                                this.onRemove()
                        } else
                            console.log("could not reject call, this is a outgoing call")
                    }
                }, {
                    key: "onRemove",
                    value: function () {
                        var e = this.client._stringeeCalls.indexOf(this);
                        e > -1 && this.client._stringeeCalls.splice(e, 1)
                    }
                }, {
                    key: "ringing",
                    value: function (e) {
                        var t = this;
                        if (this.isIncomingCall) {
                            var n = {
                                callId: this.callId,
                                code: 180
                            };
                            this.client._sendMessage(c.CALL_STATE, n, (function (n) {
                                e && e.call(t, {
                                    r: n.r
                                })
                            }
                            ))
                        } else
                            console.log("could not send ringing signal, this is a outgoing call")
                    }
                }, {
                    key: "hangup",
                    value: function (e) {
                        var t = this;
                        if (t.ended = !0,
                            t._pc || !e) {
                            var n = {
                                callId: this.callId
                            };
                            this.client._sendMessage(c.CALL_STOP, n, (function (n) {
                                0 === n.r && (t._freeResource(),
                                    t.onRemove()),
                                    e && e.call(t, {
                                        r: n.r
                                    })
                            }
                            ))
                        } else
                            e.call(t, {
                                r: -1
                            })
                    }
                }, {
                    key: "sendInfo",
                    value: function (e, t) {
                        var n = this
                            , r = {
                                callId: this.callId,
                                info: e
                            };
                        this.client._sendMessage(c.CALL_INFO, r, (function (e) {
                            t && t.call(n, {
                                r: e.r
                            })
                        }
                        ))
                    }
                }, {
                    key: "sendDtmf",
                    value: function (e, t) {
                        var n = this
                            , r = {
                                callId: this.callId,
                                digits: e
                            };
                        this.client._sendMessage(c.CALL_DTMF, r, (function (e) {
                            t && t.call(n, {
                                r: e.r
                            })
                        }
                        ))
                    }
                }, {
                    key: "sendHold",
                    value: function (e, t) {
                        var n = this
                            , r = {
                                callId: this.callId,
                                hold: !0,
                                musicOnHold: e
                            };
                        this.client._sendMessage(c.HOLD, r, (function (e) {
                            return t && t.call(n, {
                                r: e.r
                            }),
                                0 === e.r && (n.isOnHold = !0,
                                    !0)
                        }
                        ))
                    }
                }, {
                    key: "sendUnHold",
                    value: function (e) {
                        var t = this
                            , n = {
                                callId: this.callId,
                                hold: !1
                            };
                        this.client._sendMessage(c.HOLD, n, (function (n) {
                            return e && e.call(t, {
                                r: n.r
                            }),
                                0 === n.r && (t.isOnHold = !1,
                                    !0)
                        }
                        ))
                    }
                }, {
                    key: "sendTransfer",
                    value: function (e, t) {
                        var n = this
                            , r = {
                                callId: this.callId,
                                to: {
                                    number: e,
                                    type: "internal",
                                    alias: e
                                }
                            };
                        this.client._sendMessage(c.TRANSFER, r, (function (e) {
                            t && t.call(n, {
                                r: e.r
                            })
                        }
                        ))
                    }
                }, {
                    key: "_initPeerConnection",
                    value: function (e, t, n) {
                        var r = this
                            , i = {
                                audio: !0,
                                video: r._buildVideoConstraints(!1)
                            };
                        navigator.mediaDevices.getUserMedia(i).then((function (i) {
                            t && t.call(r, n);
                            try {
                                var o = {
                                    iceServers: r._iceServers
                                }
                                    , a = new RTCPeerConnection(o);
                                a.onicecandidate = function (e) {
                                    r._onicecandidate(e)
                                }
                                    ,
                                    a.oniceconnectionstatechange = function (e) {
                                        "connected" === a.iceConnectionState ? (r._mediaConnected = !0,
                                            r._callOnEvent("mediastate", {
                                                reason: "Connected",
                                                code: 1
                                            })) : "disconnected" === a.iceConnectionState && r._callOnEvent("mediastate", {
                                                reason: "Disconnected",
                                                code: 2
                                            })
                                    }
                                    ,
                                    a.ontrack = function (e) {
                                        r._ontrack(e)
                                    }
                                    ,
                                    i.getTracks().forEach((function (e) {
                                        a.addTrack(e, i)
                                    }
                                    )),
                                    i.onremovetrack = function (e) {
                                        console.log("=========localStream1.onremovetrack======", e)
                                    }
                                    ,
                                    r._pc = a,
                                    r._localStream = i,
                                    r._callOnEvent("addlocalstream", r._localStream),
                                    e ? a.createOffer((function (e) {
                                        r._onCreateLocalSdpSuccess(e)
                                    }
                                    ), r._onCreateLocalSdpError) : r._remoteSdps.size() > 0 && r._onRemoteSDP(),
                                    r.ended && (r._freeResource(),
                                        r.onRemove())
                            } catch (e) {
                                console.log(e),
                                    r._freeResource(),
                                    r.onRemove();
                                var s = {
                                    callId: r.callId
                                };
                                r.client._sendMessage(c.CALL_STOP, s, (function (e) { }
                                )),
                                    r._callOnEvent("error", {
                                        reason: "CREATE_PEER_CONNECTION_ERROR",
                                        code: 1001,
                                        moreInfo: e
                                    })
                            }
                        }
                        )).catch((function (e) {
                            t && (n.r = 1e3,
                                n.message = "GET_USER_MEDIA_ERROR",
                                n.moreInfo = e,
                                t.call(r, n)),
                                r._getUserMediaError(e)
                        }
                        ))
                    }
                }, {
                    key: "hold",
                    value: function () {
                        var e = this;
                        return e._pc ? e.isAnswered ? e.isOnHold ? (console.log("Call is on hold"),
                            !1) : (e._pc.createOffer((function (t) {
                                var n = t.sdp.replace("a=sendrecv", "a=sendonly")
                                    , r = {
                                        type: t.type,
                                        sdp: n
                                    }
                                    , i = new RTCSessionDescription(r);
                                e._onCreateLocalSdpSuccess(i)
                            }
                            ), e._onCreateLocalSdpError),
                                e.isOnHold = !0,
                                !0) : (console.log("Call not answered"),
                                    !1) : (console.log("RTCPeerConnection not created"),
                                        !1)
                    }
                }, {
                    key: "unhold",
                    value: function () {
                        var e = this;
                        return e._pc ? e.isAnswered ? e.isOnHold ? (e._pc.createOffer((function (t) {
                            var n = t.sdp.replace("a=sendonly", "a=sendrecv");
                            n = n.replace("a=inactive", "a=sendrecv");
                            var r = {
                                type: t.type,
                                sdp: n
                            }
                                , i = new RTCSessionDescription(r);
                            e._onCreateLocalSdpSuccess(i)
                        }
                        ), e._onCreateLocalSdpError),
                            e.isOnHold = !1,
                            !0) : (console.log("Call is not on hold"),
                                !1) : (console.log("Call not answered"),
                                    !1) : (console.log("RTCPeerConnection not created"),
                                        !1)
                    }
                }, {
                    key: "_onRemoteSDP",
                    value: function () {
                        var e, t = this, n = !1;
                        0 !== t._remoteSdps.size() && t._pc && (e = t._remoteSdps.get(t._remoteSdps.allKeys()[0]),
                            null !== t._answeredDeviceId && void 0 !== t._answeredDeviceId || (t._answeredDeviceId = ""),
                            "offer" === e.type && t.fromInternal && (n = !0),
                            !t.fromInternal && t.isAnswered && (n = !0),
                            "answer" === e.type && t.isAnswered && (n = !0,
                                e = t._remoteSdps.get(t._answeredDeviceId)),
                            t.isIncomingCall || "external" !== t.toType || (n = !0),
                            n && e && (t._pc.setRemoteDescription(e, (function () {
                                t._setRemoteSdpOk = !0,
                                    t._checkAndAddCandidateFromQueue(),
                                    "offer" === e.type && t._pc.createAnswer().then((function (e) {
                                        t._onCreateLocalSdpSuccess(e)
                                    }
                                    ), t._onCreateLocalSdpError)
                            }
                            ), (function (e) {
                                console.log("setRemoteDescription error", e)
                            }
                            )),
                                t._remoteSdps.clear()))
                    }
                }, {
                    key: "_getUserMediaError",
                    value: function (e) {
                        this.isIncomingCall ? this._callOnEvent("error", {
                            reason: "GET_USER_MEDIA_ERROR",
                            code: 1e3,
                            moreInfo: e
                        }) : this.client._sendMessage(c.CALL_STOP, {
                            callId: this.callId
                        }, (function (e) { }
                        ))
                    }
                }, {
                    key: "upgradeToVideoCall",
                    value: function () {
                        var e = this;
                        if (!e.isVideoCall) {
                            var t = {
                                audio: !1,
                                video: e._buildVideoConstraints(!0)
                            };
                            navigator.mediaDevices.getUserMedia(t).then((function (t) {
                                var n = t.getVideoTracks()[0];
                                e._localStream.addTrack(n),
                                    e._callOnEvent("addlocalstream", e._localStream),
                                    e._pc.addTrack(n, t),
                                    e._pc.createOffer((function (t) {
                                        e._onCreateLocalSdpSuccess(t)
                                    }
                                    ), e._onCreateLocalSdpError),
                                    e.isVideoCall = !0,
                                    e.localVideoEnabled = !0
                            }
                            )).catch((function (t) {
                                e._getUserMediaError(t)
                            }
                            ))
                        }
                    }
                }, {
                    key: "_buildVideoConstraints",
                    value: function (e) {
                        return e ? !this.videoResolution || {
                            width: {
                                exact: this.videoResolution.width
                            },
                            height: {
                                exact: this.videoResolution.height
                            }
                        } : this.isVideoCall && this.videoResolution ? {
                            width: {
                                exact: this.videoResolution.width
                            },
                            height: {
                                exact: this.videoResolution.height
                            }
                        } : this.isVideoCall
                    }
                }, {
                    key: "_checkAndAddCandidateFromQueue",
                    value: function () {
                        if (this.isAnswered && this._pc && this._setRemoteSdpOk) {
                            this._answeredDeviceId || (this._answeredDeviceId = this._mapListCandidates.allKeys()[0]);
                            var e = this._mapListCandidates.get("" + this._answeredDeviceId);
                            if (e)
                                for (; ;) {
                                    var t = e.pop();
                                    if (!t)
                                        break;
                                    this._pc.addIceCandidate(t)
                                }
                        }
                    }
                }, {
                    key: "_onicecandidate",
                    value: function (e) {
                        if (e.candidate) {
                            var t = e.candidate;
                            this._sendCallSdpCandidate(this.callId, "candidate", t)
                        }
                    }
                }, {
                    key: "_ontrack",
                    value: function (e) {
                        this._remoteStream = e.streams[0],
                            this._callOnEvent("addremotestream", this._remoteStream)
                    }
                }, {
                    key: "_onCreateLocalSdpSuccess",
                    value: function (e) {
                        var t = this;
                        this._localSdp = e,
                            this._pc.setLocalDescription(e, (function () {
                                t._sendCallSdpCandidate(t.callId, "sdp", e)
                            }
                            ), (function (e) {
                                console.log("+++++++++ setLocalDescription error", e)
                            }
                            ))
                    }
                }, {
                    key: "_onCreateLocalSdpError",
                    value: function (e) {
                        console.log(e)
                    }
                }, {
                    key: "_sendCallSdpCandidate",
                    value: function (e, t, n) {
                        var r = {
                            callId: e,
                            type: t,
                            data: n
                        };
                        this.client._sendMessage(c.CALL_SDP_CANDIDATE, r, (function (e) { }
                        ))
                    }
                }, {
                    key: "_freeResource",
                    value: function () {
                        if (this._pc) {
                            var e = this;
                            this._pc.close(),
                                this._pc = null,
                                this._localStream && this._localStream.getTracks().forEach((function (t) {
                                    t.stop(),
                                        e._localStream.removeTrack(t)
                                }
                                )),
                                this._localStream = null,
                                this._remoteStream = null
                        }
                    }
                }, {
                    key: "mute",
                    value: function (e) {
                        var t = this;
                        t._localStream.getAudioTracks().forEach((function (n) {
                            e ? (n.enabled = !1,
                                t.muted = !0) : (n.enabled = !0,
                                    t.muted = !1)
                        }
                        ))
                    }
                }, {
                    key: "enableLocalVideo",
                    value: function (e) {
                        var t = this
                            , n = !1;
                        return t._localStream.getVideoTracks().forEach((function (r) {
                            n = !0,
                                r.enabled = e,
                                t.localVideoEnabled = e
                        }
                        )),
                            n
                    }
                }, {
                    key: "on",
                    value: function (e, t) {
                        this._onMethods.put(e, t)
                    }
                }, {
                    key: "_callOnEvent",
                    value: function (e, t) {
                        var n = this._onMethods.get(e);
                        n ? t ? n.call(this, t) : n.call(this) : console.log("Please implement StringeeCall event: " + e)
                    }
                }, {
                    key: "restartIce",
                    value: function () {
                        var e = this;
                        if (!e._pc)
                            return console.log("RTCPeerConnection not created"),
                                !1;
                        console.log("restartIce+++++");
                        var t = {
                            offerToReceiveAudio: 1,
                            offerToReceiveVideo: 1,
                            iceRestart: !0
                        };
                        return e._setLocalSdpOk || !e.isIncomingCall ? (console.log("=====create offer==="),
                            e._pc.createOffer((function (t) {
                                e._onCreateLocalSdpSuccess(t)
                            }
                            ), e._onCreateLocalSdpError, t)) : (console.log("=====create Answer==="),
                                e._pc.createAnswer().then((function (t) {
                                    e._onCreateLocalSdpSuccess(t)
                                }
                                ), e._onCreateLocalSdpError, t)),
                            !0
                    }
                }]) && ge(t.prototype, n),
                r && ge(t, r),
                e
        }();
        function Se(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        var _e = function () {
            function e(t) {
                !function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                    this.localId = Ie.genLocalPeerConnectionId(),
                    this.serverId = "",
                    this.pc = null,
                    this.eventHandler = null,
                    this.mediaConnected = !1,
                    this.localStream = null,
                    this.remoteStream = null,
                    this.stopped = !1,
                    this.iceServers = t,
                    this.localSdp = null,
                    this.localCandidates = new Array,
                    this.muted = !1,
                    this.localVideoEnabled = !0
            }
            var t, n, r;
            return t = e,
                (n = [{
                    key: "initPeerConnection",
                    value: function (e, t, n, r) {
                        var i = this;
                        function o(t) {
                            try {
                                var o = {
                                    iceServers: i.iceServers
                                }
                                    , a = new RTCPeerConnection(o);
                                a.onicecandidate = function (e) {
                                    e.candidate && i.localCandidates.push(e.candidate),
                                        n.onCandidate(e.candidate)
                                }
                                    ,
                                    a.oniceconnectionstatechange = function (e) {
                                        "connected" === a.iceConnectionState ? (i.mediaConnected = !0,
                                            n.onIceConnectionStateChange(i.mediaConnected)) : "disconnected" === a.iceConnectionState && (i.mediaConnected = !1,
                                                n.onIceConnectionStateChange(i.mediaConnected))
                                    }
                                    ,
                                    a.ontrack = function (e) {
                                        if (e.streams.length > 0) {
                                            i.remoteStream = e.streams[0];
                                            var t = "";
                                            e.track && (t = e.track.kind),
                                                n.onTrack(e, t)
                                        }
                                    }
                                    ,
                                    t.getTracks().forEach((function (e) {
                                        a.addTrack(e, t)
                                    }
                                    )),
                                    t.onremovetrack = function (e) {
                                        console.log("=========localStream1.onremovetrack======", e)
                                    }
                                    ,
                                    i.pc = a,
                                    i.localStream = t,
                                    n.onLocalStream(t),
                                    e && a.createOffer((function (e) {
                                        i.localSdp = e,
                                            n.onLocalSdp(!0, e),
                                            i.pc.setLocalDescription(e, (function () {
                                                n.onSetLocalDescription(!0, e)
                                            }
                                            ), (function (e) {
                                                n.onSetLocalDescription(!1, e)
                                            }
                                            ))
                                    }
                                    ), (function (e) {
                                        n.onLocalSdp(!1, e)
                                    }
                                    ), r),
                                    n.onAccessMediaDevice(!0, null),
                                    i.stopped && i.freeResource()
                            } catch (e) {
                                n.onAccessMediaDevice(!1, e),
                                    i.freeResource()
                            }
                        }
                        function a(e) {
                            n.onAccessMediaDevice(!1, e)
                        }
                        this.eventHandler = n,
                            t.screen ? navigator.getDisplayMedia ? navigator.getDisplayMedia({
                                video: !0
                            }).then(o).catch(a) : navigator.mediaDevices.getDisplayMedia ? navigator.mediaDevices.getDisplayMedia({
                                video: !0
                            }).then(o).catch(a) : navigator.mediaDevices.getUserMedia({
                                video: {
                                    mediaSource: "screen"
                                }
                            }).then(o).catch(a) : navigator.mediaDevices.getUserMedia(t).then(o).catch(a)
                    }
                }, {
                    key: "initPeerConnectionNoAccessDevice",
                    value: function (e, t, n) {
                        var r = this;
                        this.eventHandler = n;
                        try {
                            var i = {
                                iceServers: r.iceServers
                            }
                                , o = new RTCPeerConnection(i);
                            o.onicecandidate = function (e) {
                                e.candidate && r.localCandidates.push(e.candidate),
                                    n.onCandidate(e.candidate)
                            }
                                ,
                                o.oniceconnectionstatechange = function (e) {
                                    "connected" === o.iceConnectionState ? (r.mediaConnected = !0,
                                        n.onIceConnectionStateChange(r.mediaConnected)) : "disconnected" === o.iceConnectionState && (r.mediaConnected = !1,
                                            n.onIceConnectionStateChange(r.mediaConnected))
                                }
                                ,
                                o.ontrack = function (e) {
                                    if (e.streams.length > 0) {
                                        r.remoteStream = e.streams[0];
                                        var t = "";
                                        e.track && (t = e.track.kind),
                                            n.onTrack(e, t)
                                    }
                                }
                                ,
                                r.pc = o,
                                e && o.createOffer((function (e) {
                                    r.localSdp = e,
                                        n.onLocalSdp(!0, e),
                                        r.pc.setLocalDescription(e, (function () {
                                            n.onSetLocalDescription(!0, e)
                                        }
                                        ), (function (e) {
                                            n.onSetLocalDescription(!1, e)
                                        }
                                        ))
                                }
                                ), (function (e) {
                                    n.onLocalSdp(!1, e)
                                }
                                ), t),
                                r.stopped && r.freeResource()
                        } catch (e) {
                            r.freeResource()
                        }
                    }
                }, {
                    key: "freeResource",
                    value: function () {
                        this.pc && (this.pc.close(),
                            this.pc = null);
                        var e = this;
                        this.localStream && this.localStream.getTracks().forEach((function (t) {
                            t.stop(),
                                e.localStream.removeTrack(t)
                        }
                        )),
                            this.localStream = null,
                            this.remoteStream = null,
                            this.eventHandler.onWebRtcClose()
                    }
                }, {
                    key: "onReceiveSdp",
                    value: function (e) {
                        this.pc.setRemoteDescription(e, (function () { }
                        ), (function (e) {
                            console.log("setRemoteDescription error", e)
                        }
                        ))
                    }
                }, {
                    key: "onReceiveCandidate",
                    value: function (e) {
                        this.pc.addIceCandidate(e)
                    }
                }, {
                    key: "mute",
                    value: function (e) {
                        var t = this;
                        t.localStream.getAudioTracks().forEach((function (n) {
                            e ? (n.enabled = !1,
                                t.muted = !0) : (n.enabled = !0,
                                    t.muted = !1)
                        }
                        ))
                    }
                }, {
                    key: "enableLocalVideo",
                    value: function (e) {
                        var t = this
                            , n = !1;
                        return t.localStream.getVideoTracks().forEach((function (r) {
                            n = !0,
                                r.enabled = e,
                                t.localVideoEnabled = e
                        }
                        )),
                            n
                    }
                }]) && Se(t.prototype, n),
                r && Se(t, r),
                e
        }();
        function Te(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        var Ee = function () {
            function e(t, n) {
                !function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                    this.isLocal = !0,
                    this.roomConnected = null,
                    this.localSdpToSend = null,
                    this.localCandidatesForSend = new Array,
                    this.serverId = "",
                    this.serverPeerConnectionId = "",
                    this.stringeeClient = t,
                    this.audio = !0,
                    this.video = !0,
                    this.screen = !1,
                    this.constraints = {},
                    n.screen ? (this.constraints.screen = !0,
                        this.screen = !0,
                        this.audio = !1,
                        this.video = !1) : (n.audio && (this.constraints.audio = !0,
                            this.audio = !0),
                            n.video && (this.video = !0,
                                this.constraints.video = !0)),
                    n.videoDimensions && (this.constraints.video = n.videoDimensions),
                    this.webrtc = new _e(t.ice_servers),
                    this.localId = this.webrtc.localId,
                    this.onMethods = new StringeeHashMap,
                    this.elements = [],
                    this.callOnReady = !1,
                    this.muted = !1,
                    this.localVideoEnabled = !0
            }
            var t, n, r;
            return t = e,
                (n = [{
                    key: "init",
                    value: function () {
                        var e = this;
                        return new Promise((function (t, n) {
                            var r = {
                                onAccessMediaDevice: function (e, t) {
                                    e || n(t)
                                },
                                onLocalStream: function (e) { },
                                onTrack: function (t, n) {
                                    var r = t.streams[0];
                                    e.onRemoteStream(r, n)
                                },
                                onLocalSdp: function (e, t) { },
                                onSetLocalDescription: function (r, i) {
                                    r ? (e.localSdpToSend = i,
                                        e.processSendSdpCandidate(),
                                        t(e)) : n("Set Local Description error")
                                },
                                onIceConnectionStateChange: function (e) { },
                                onCandidate: function (t) {
                                    e.localCandidatesForSend.push(t),
                                        e.processSendSdpCandidate()
                                },
                                onWebRtcClose: function () { }
                            };
                            if (e.isLocal) {
                                var i = {
                                    offerToReceiveAudio: 0,
                                    offerToReceiveVideo: 0
                                };
                                e.webrtc.initPeerConnection(!0, e.constraints, r, i)
                            } else
                                i = {},
                                    e.constraints.audio && (i.offerToReceiveAudio = 1),
                                    e.constraints.video && (i.offerToReceiveVideo = 1),
                                    e.webrtc.initPeerConnectionNoAccessDevice(!0, i, r)
                        }
                        ))
                    }
                }, {
                    key: "onRemoteStream",
                    value: function (e, t) {
                        this.callOnReady || (this.callOnReady = !0,
                            this.callOnEvent("ready", t))
                    }
                }, {
                    key: "processSendSdpCandidate",
                    value: function () {
                        if (this.roomConnected && this.webrtc) {
                            if (this.localSdpToSend) {
                                var e = {
                                    data: this.localSdpToSend,
                                    roomId: this.roomConnected.roomId,
                                    serverPcId: this.webrtc.serverId,
                                    isLocal: this.isLocal,
                                    serverTrackId: this.serverId
                                };
                                this.stringeeClient._sendMessage(c.VIDEO_ENDPOINT_SDP, e, (function (e) { }
                                )),
                                    this.localSdpToSend = null
                            }
                            for (; this.localCandidatesForSend.length > 0;) {
                                var t = this.localCandidatesForSend.pop();
                                t && (e = {
                                    data: t,
                                    roomId: this.roomConnected.roomId,
                                    serverPcId: this.webrtc.serverId,
                                    isLocal: this.isLocal,
                                    serverTrackId: this.serverId
                                },
                                    this.stringeeClient._sendMessage(c.VIDEO_ENDPOINT_CANDIDATE, e, (function (e) { }
                                    )))
                            }
                        }
                    }
                }, {
                    key: "attach",
                    value: function () {
                        var e = document.createElement("video");
                        return e.classList.add("stringee-video-track-" + this.localId),
                            e.srcObject = null,
                            this.isLocal ? e.srcObject = this.webrtc.localStream : e.srcObject = this.webrtc.remoteStream,
                            e.setAttribute("autoplay", "true"),
                            this.isLocal && (e.muted = !0),
                            this.elements.push(e),
                            e
                    }
                }, {
                    key: "detach",
                    value: function () {
                        return this.elements
                    }
                }, {
                    key: "detachAndRemove",
                    value: function () {
                        this.elements.forEach((function (e) {
                            e.remove()
                        }
                        ))
                    }
                }, {
                    key: "getMediaStream",
                    value: function () {
                        return this.webrtc ? this.isLocal ? this.webrtc.localStream : this.webrtc.remoteStream : null
                    }
                }, {
                    key: "onSdpFromServer",
                    value: function (e) {
                        this.webrtc && this.webrtc.onReceiveSdp(e)
                    }
                }, {
                    key: "onCandidateFromServer",
                    value: function (e) {
                        this.webrtc && this.webrtc.onReceiveCandidate(e)
                    }
                }, {
                    key: "close",
                    value: function () {
                        this.webrtc.freeResource()
                    }
                }, {
                    key: "mute",
                    value: function (e) {
                        this.webrtc.mute(e),
                            this.muted = this.webrtc.muted
                    }
                }, {
                    key: "enableLocalVideo",
                    value: function (e) {
                        var t = this.webrtc.enableLocalVideo(e);
                        return this.localVideoEnabled = this.webrtc.localVideoEnabled,
                            t
                    }
                }, {
                    key: "on",
                    value: function (e, t) {
                        var n = this.onMethods.get(e);
                        n || (n = new Array,
                            this.onMethods.put(e, n)),
                            n.push(t)
                    }
                }, {
                    key: "callOnEvent",
                    value: function (e, t) {
                        var n = this
                            , r = this.onMethods.get(e);
                        r ? r.forEach((function (e) {
                            t ? e.call(n, t) : e.call(n)
                        }
                        )) : console.log("Please implement StringeeVideoTrack event: " + e)
                    }
                }]) && Te(t.prototype, n),
                r && Te(t, r),
                e
        }();
        function ye(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        function Re(e, t, n) {
            return t in e ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = n,
                e
        }
        var Ie = function () {
            function e() {
                !function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            var t, n, r;
            return t = e,
                r = [{
                    key: "genLocalTrackId",
                    value: function () {
                        if (0 == e.ID_GEN) {
                            var t = new Date;
                            e.ID_GEN = t.getTime()
                        }
                        return e.ID_GEN++,
                            "track-" + e.ID_GEN
                    }
                }, {
                    key: "genLocalPeerConnectionId",
                    value: function () {
                        if (0 == e.ID_GEN) {
                            var t = new Date;
                            e.ID_GEN = t.getTime()
                        }
                        return e.ID_GEN++,
                            "pc-" + e.ID_GEN
                    }
                }, {
                    key: "makeCall",
                    value: function (t, n, r, i, o) {
                        return new Promise((function (a, s) {
                            var l = {
                                fromNumber: n,
                                toNumber: r,
                                video: i,
                                custom: o
                            };
                            t._sendMessage(c.VIDEO_ROOM_MAKE_CALL, l, (function (n) {
                                if (console.log("res", n),
                                    0 == n.r) {
                                    var r = new StringeeVideoRoom(t);
                                    r.roomId = n.roomId,
                                        e.rooms.put(r.roomId, r);
                                    var i = {
                                        room: r,
                                        roomToken: n.roomToken,
                                        callId: n.callId
                                    };
                                    a(i)
                                } else
                                    s(n)
                            }
                            ))
                        }
                        ))
                    }
                }, {
                    key: "createRoom",
                    value: function (t) {
                        return new Promise((function (n, r) {
                            t._sendMessage(c.VIDEO_ENDPOINT_MAKE_ROOM, {}, (function (i) {
                                if (0 == i.r) {
                                    var o = new StringeeVideoRoom(t);
                                    o.roomId = i.roomId,
                                        e.rooms.put(o.roomId, o),
                                        n(o)
                                } else
                                    r(i)
                            }
                            ))
                        }
                        ))
                    }
                }, {
                    key: "joinRoom",
                    value: function (t, n) {
                        return new Promise((function (r, i) {
                            var o = {
                                roomToken: n
                            };
                            t._sendMessage(c.VIDEO_ENDPOINT_JOIN_ROOM, o, (function (n) {
                                if (0 == n.r) {
                                    var o = e.rooms.get(n.roomId);
                                    o || (o = new StringeeVideoRoom(t)),
                                        o.roomId = n.roomId,
                                        o.permissionSubscribe = n.permissionSubscribe,
                                        o.permissionPublish = n.permissionPublish,
                                        o.permissionControlRoom = n.permissionControlRoom,
                                        o.record = n.record,
                                        e.rooms.put(o.roomId, o);
                                    var a = {
                                        room: o,
                                        listTracksInfo: n.tracks,
                                        listUsersInfo: n.users
                                    };
                                    r(a)
                                } else
                                    i(n)
                            }
                            ))
                        }
                        ))
                    }
                }, {
                    key: "createLocalVideoTrack",
                    value: function (e, t) {
                        var n = new Ee(e, t);
                        return n.isLocal = !0,
                            n.init()
                    }
                }],
                (n = null) && ye(t.prototype, n),
                r && ye(t, r),
                e
        }();
        function ke(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        Re(Ie, "rooms", new l),
            Re(Ie, "ID_GEN", 0);
        var Oe = function () {
            function e(t, n, r, i) {
                !function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                    this.client = t,
                    this.fromNumber = n,
                    this.toNumber = r,
                    this.custom = "",
                    this.customDataFromYourServer = "",
                    this.fromAlias = n,
                    this.toAlias = r,
                    this.fromInternal = !0,
                    this.answeredOnAnotherDevice = !1,
                    this.isVideoCall = i,
                    this.isIncomingCall = !1,
                    this.isAnswered = !1,
                    this.isOnHold = !1,
                    this._answeredDeviceId = "",
                    this.ended = !1,
                    this.callId = "",
                    this.room = null,
                    this.roomToken = "",
                    this.localTracks = [],
                    this.subscribedTracks = [],
                    this.toType = "",
                    this.muted = !1,
                    this.localVideoEnabled = i,
                    this._onMethods = new l,
                    this.client._stringeeCalls2.push(this),
                    this.videoResolution = null
            }
            var t, n, r;
            return t = e,
                (n = [{
                    key: "makeCall",
                    value: function (e) {
                        if (this.isIncomingCall)
                            console.log("could not make call, this is a incoming call");
                        else {
                            var t = this
                                , n = {
                                    fromNumber: this.fromNumber,
                                    toNumber: this.toNumber,
                                    video: this.isVideoCall,
                                    custom: t.custom
                                };
                            t.client._sendMessage(c.VIDEO_ROOM_MAKE_CALL, n, (function (n) {
                                0 == n.r && (t.roomToken = n.roomToken,
                                    delete n.roomToken,
                                    delete n.roomId,
                                    t.callId = n.callId,
                                    t.toType = n.toType,
                                    t.customDataFromYourServer = n.customDataFromYourServer,
                                    t._createLocalVideoTrack()),
                                    e.call(t, n)
                            }
                            ))
                        }
                    }
                }, {
                    key: "answer",
                    value: function (e) {
                        var t = this;
                        if (this.isIncomingCall)
                            if (this.isAnswered)
                                console.log("Error: call has been answered");
                            else if (this.answeredOnAnotherDevice)
                                console.log("Error: call has been answered on other device");
                            else {
                                this.isAnswered = !0;
                                var n = {
                                    callId: this.callId,
                                    code: 200
                                };
                                this.client._sendMessage(c.VIDEO_ROOM_CALL_STATE, n, (function (n) {
                                    0 == n.r && t._createLocalVideoTrack(),
                                        e && e.call(t, {
                                            r: n.r
                                        })
                                }
                                ))
                            }
                        else
                            console.log("Error: could not answer call, this is a outgoing call")
                    }
                }, {
                    key: "reject",
                    value: function (e) {
                        var t = this;
                        if (this.isIncomingCall) {
                            t.ended = !0;
                            var n = {
                                callId: this.callId,
                                code: 486
                            };
                            this.client._sendMessage(c.VIDEO_ROOM_CALL_STATE, n, (function (n) {
                                e && e.call(t, {
                                    r: n.r
                                })
                            }
                            )),
                                this.onRemove()
                        } else
                            console.log("could not reject call, this is a outgoing call")
                    }
                }, {
                    key: "ringing",
                    value: function (e) {
                        var t = this;
                        if (this.isIncomingCall) {
                            var n = {
                                callId: this.callId,
                                code: 180
                            };
                            this.client._sendMessage(c.VIDEO_ROOM_CALL_STATE, n, (function (n) {
                                e && e.call(t, {
                                    r: n.r
                                })
                            }
                            ))
                        } else
                            console.log("could not send ringing signal, this is a outgoing call")
                    }
                }, {
                    key: "hangup",
                    value: function (e) {
                        var t = this;
                        t.ended = !0;
                        var n = {
                            callId: this.callId
                        };
                        this.client._sendMessage(c.VIDEO_ROOM_END_CALL, n, (function (n) {
                            0 === n.r && t.onRemove(),
                                e && e.call(t, {
                                    r: n.r
                                })
                        }
                        ))
                    }
                }, {
                    key: "_createLocalVideoTrack",
                    value: function () {
                        var e = null;
                        this.videoResolution && (e = {
                            width: {
                                min: this.videoResolution.width,
                                max: this.videoResolution.width
                            },
                            height: {
                                min: this.videoResolution.height,
                                max: this.videoResolution.height
                            }
                        });
                        var t = {
                            audio: !0,
                            video: !0,
                            screen: !1,
                            videoDimensions: e
                        }
                            , n = this;
                        Ie.createLocalVideoTrack(n.client, t).then((function (e) {
                            n.localTracks.push(e),
                                n._callOnEvent("addlocalstream", e.webrtc.localStream),
                                Ie.joinRoom(n.client, n.roomToken).then((function (t) {
                                    var r = t.room;
                                    n.room = r,
                                        r.clearAllOnMethos(),
                                        r.on("joinroom", (function (e) { }
                                        )),
                                        r.on("leaveroom", (function (e) { }
                                        )),
                                        r.on("addtrack", (function (e) {
                                            var t = !1;
                                            n.localTracks.forEach((function (n) {
                                                n.serverId === e.info.track.serverId && (t = !0)
                                            }
                                            )),
                                                t || n._subscribe(e.info.track)
                                        }
                                        )),
                                        r.on("removetrack", (function (e) {
                                            var t = e.track;
                                            t && t.detach().forEach((function (e) {
                                                e.remove()
                                            }
                                            ))
                                        }
                                        )),
                                        r.publish(e).then((function () { }
                                        )).catch((function (e) {
                                            console.log("publish Local Video Track ERROR: ", e)
                                        }
                                        )),
                                        t.listTracksInfo.forEach((function (e) {
                                            n._subscribe(e)
                                        }
                                        ))
                                }
                                )).catch((function (e) {
                                    console.log("join room ERROR: ", e)
                                }
                                ))
                        }
                        )).catch((function (e) {
                            console.log("create Local Video Track ERROR: ", e)
                        }
                        ))
                    }
                }, {
                    key: "_subscribe",
                    value: function (e) {
                        var t = this;
                        t.room.subscribe(e.serverId, {
                            audio: !0,
                            video: !0
                        }).then((function (e) {
                            t.subscribedTracks.push(e),
                                e.on("ready", (function () {
                                    t._callOnEvent("addremotestream", e.webrtc.remoteStream)
                                }
                                ))
                        }
                        )).catch((function (e) {
                            console.log("subscribe ERROR: ", e)
                        }
                        ))
                    }
                }, {
                    key: "on",
                    value: function (e, t) {
                        this._onMethods.put(e, t)
                    }
                }, {
                    key: "_callOnEvent",
                    value: function (e, t) {
                        var n = this._onMethods.get(e);
                        n ? t ? n.call(this, t) : n.call(this) : console.log("Please implement StringeeCall event: " + e)
                    }
                }, {
                    key: "onRemove",
                    value: function () {
                        var e = this.client._stringeeCalls2.indexOf(this);
                        e > -1 && this.client._stringeeCalls2.splice(e, 1)
                    }
                }, {
                    key: "mute",
                    value: function (e) {
                        this.localTracks.forEach((function (t) {
                            t.mute(e)
                        }
                        )),
                            this.muted = e
                    }
                }, {
                    key: "enableLocalVideo",
                    value: function (e) {
                        var t = this;
                        t.localTracks.forEach((function (n) {
                            n.enableLocalVideo(e) && (t.localVideoEnabled = e)
                        }
                        ))
                    }
                }]) && ke(t.prototype, n),
                r && ke(t, r),
                e
        }();
        function Ae(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        var be = function () {
            function e() {
                !function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            var t, n, r;
            return t = e,
                r = [{
                    key: "_callSdpCandidateFromServer",
                    value: function (e, t) {
                        var n = e.findCallByCallId(t.callId);
                        if (n)
                            if (n.answeredOnAnotherDevice)
                                console.log("answeredOnAnotherDevice");
                            else {
                                var r = t.deviceId;
                                if (r || (r = ""),
                                    "sdp" === t.type) {
                                    var i = t.data.sdp
                                        , o = i.match(/a=candidate([^\r\n]+)/g);
                                    o && -1 === i.indexOf("typ srflx") && o.forEach((function (e) {
                                        var t;
                                        t = (t = (t = (t = e.replace(" generation 0", "")).replace("typ host", "typ srflx")).replace("typ host", "typ srflx")).replace("\n", ""),
                                            t += " raddr 172.20.1.2 rport 57527 generation 0";
                                        var n = i.indexOf(e);
                                        n > -1 && (i = [i.slice(0, n), t + "\n", i.slice(n)].join(""))
                                    }
                                    ));
                                    var a = {
                                        type: t.data.type,
                                        sdp: i
                                    }
                                        , s = new RTCSessionDescription(a);
                                    n._remoteSdps.put(r + "", s),
                                        n._pc && n._onRemoteSDP()
                                } else if ("candidate" === t.type) {
                                    var c = new RTCIceCandidate(t.data)
                                        , d = n._mapListCandidates.get(r + "");
                                    d || (d = new l,
                                        n._mapListCandidates.put(r + "", d)),
                                        d.push(c),
                                        n._checkAndAddCandidateFromQueue()
                                }
                            }
                        else
                            console.log("error could not found call for: " + t.callId)
                    }
                }, {
                    key: "_callStateFromServer",
                    value: function (e, t) {
                        var n = e.findCallByCallId(t.callId);
                        if (n) {
                            var r = -1
                                , i = ""
                                , o = t.deviceId;
                            o || (o = ""),
                                100 === t.code ? (r = d,
                                    i = "Calling") : 180 === t.code || 183 === t.code ? (r = u,
                                        i = "Ringing") : 486 === t.code || 603 === t.code ? (r = v,
                                            i = "Busy here") : t.code >= 400 ? (r = f,
                                                i = "Ended") : 200 === t.code && (r = p,
                                                    i = "Answered",
                                                    n._answeredDeviceId = o),
                                t.code >= 400 ? n.ended = !0 : 200 === t.code && (n.isAnswered = !0),
                                r > -1 ? n._callOnEvent("signalingstate", {
                                    reason: i,
                                    code: r,
                                    sipCode: t.code,
                                    sipReason: t.reason
                                }) : console.log("error: unknow code: " + t.code),
                                t.code >= 400 ? (n._freeResource(),
                                    n.onRemove()) : 200 === t.code && (n._pc && n._onRemoteSDP(),
                                        n._checkAndAddCandidateFromQueue())
                        } else
                            console.log("error could not found call for: " + t.callId)
                    }
                }, {
                    key: "_callStopFromServer",
                    value: function (e, t) {
                        var n = e.findCallByCallId(t.callId);
                        n ? (n.ended = !0,
                            n._freeResource(),
                            n.onRemove(),
                            n._callOnEvent("signalingstate", {
                                reason: "Ended",
                                code: f,
                                sipCode: -1,
                                sipReason: "Bye"
                            })) : console.log("error could not found call for: " + t.callId)
                    }
                }, {
                    key: "_callStartFromServer",
                    value: function (e, t) {
                        var n = new Ce(e, t.fromNumber, t.toNumber, t.video);
                        n._iceServers = t.iceServers,
                            n.callId = t.callId,
                            n.isIncomingCall = !0,
                            n.fromAlias = t.fromAlias,
                            n.toAlias = t.toAlias,
                            n.fromInternal = t.fromInternal,
                            n.customDataFromYourServer = t.customDataFromYourServer,
                            n._initPeerConnection(!1),
                            e._callOnEvent("incomingcall", n)
                    }
                }, {
                    key: "_callInfoFromServer",
                    value: function (e, t) {
                        var n = e.findCallByCallId(t.callId);
                        n ? n._callOnEvent("info", t.info) : console.log("error could not found call for: " + t.callId)
                    }
                }, {
                    key: "_videoEndPointSdpFromServer",
                    value: function (e, t) {
                        var n = new RTCSessionDescription({
                            type: t.data.type,
                            sdp: t.data.sdp
                        })
                            , r = t.localTrackId
                            , i = t.serverTrackId
                            , o = Ie.rooms.get(t.roomId);
                        o ? o.onReceiveSdp1(r, i, n) : console.log("room not found: " + t.roomId)
                    }
                }, {
                    key: "_videoEndPointCandidateFromServer",
                    value: function (e, t) {
                        var n = new RTCIceCandidate(JSON.parse(t.data))
                            , r = t.localTrackId
                            , i = t.serverTrackId
                            , o = Ie.rooms.get(t.roomId);
                        o ? o.onReceiveCandidate1(r, i, n) : console.log("room not found: " + t.roomId)
                    }
                }, {
                    key: "_videoTrackAddedFromServer",
                    value: function (e, t) {
                        var n = Ie.rooms.get(t.roomId);
                        n ? n.onTrackAdded(t) : console.log("room not found: " + t.roomId)
                    }
                }, {
                    key: "_videoTrackRemovedFromServer",
                    value: function (e, t) {
                        var n = Ie.rooms.get(t.roomId);
                        n ? n.onTrackRemoved(t) : console.log("room not found: " + t.roomId)
                    }
                }, {
                    key: "_videoRoomJoinedFromServer",
                    value: function (e, t) {
                        var n = Ie.rooms.get(t.roomId);
                        n ? n.onRoomJoined(t) : console.log("room not found: " + t.roomId)
                    }
                }, {
                    key: "_videoRoomLeftFromServer",
                    value: function (e, t) {
                        var n = Ie.rooms.get(t.roomId);
                        n ? n.onRoomLeft(t) : console.log("room not found: " + t.roomId)
                    }
                }, {
                    key: "_videoRoomMsgFromServer",
                    value: function (e, t) {
                        var n = Ie.rooms.get(t.roomId);
                        n ? n.onRoomMsg(t) : console.log("room not found: " + t.roomId)
                    }
                }, {
                    key: "_videoRoomCallInviteFromServer",
                    value: function (e, t) {
                        var n = new Oe(e, t.fromNumber, t.toNumber, t.video);
                        n.callId = t.callId,
                            n.isIncomingCall = !0,
                            n.fromAlias = t.fromAlias,
                            n.toAlias = t.toAlias,
                            n.customDataFromYourServer = t.customDataFromYourServer,
                            n.roomToken = t.roomToken,
                            e._callOnEvent("incomingcall2", n)
                    }
                }, {
                    key: "_videoRoomCallInviteCancelFromServer",
                    value: function (t, n) {
                        e._call2EndFromServer(t, n)
                    }
                }, {
                    key: "_call2StateFromServer",
                    value: function (e, t) {
                        var n = e.findCall2ByCallId(t.callId);
                        if (n) {
                            var r = -1
                                , i = ""
                                , o = t.deviceId;
                            o || (o = ""),
                                100 === t.code ? (r = d,
                                    i = "Calling") : 180 === t.code || 183 === t.code ? (r = u,
                                        i = "Ringing") : 486 === t.code || 603 === t.code ? (r = v,
                                            i = "Busy here") : t.code >= 400 ? (r = f,
                                                i = "Ended") : 200 === t.code && (r = p,
                                                    i = "Answered",
                                                    n._answeredDeviceId = o),
                                t.code >= 400 ? n.ended = !0 : 200 === t.code && (n.isAnswered = !0),
                                r > -1 ? n._callOnEvent("signalingstate", {
                                    reason: i,
                                    code: r,
                                    sipCode: t.code,
                                    sipReason: t.reason
                                }) : console.log("error: unknow code: " + t.code),
                                t.code >= 400 && n.onRemove()
                        } else
                            console.log("error could not found call for: " + t.callId)
                    }
                }, {
                    key: "_call2EndFromServer",
                    value: function (e, t) {
                        var n = e.findCall2ByCallId(t.callId);
                        if (n) {
                            var r = t.deviceId;
                            r || (r = "");
                            var i = f;
                            n.ended = !0,
                                n._callOnEvent("signalingstate", {
                                    reason: "Ended",
                                    code: i,
                                    sipCode: t.code,
                                    sipReason: t.reason
                                }),
                                n.onRemove()
                        } else
                            console.log("error could not found call for: " + t.callId)
                    }
                }],
                (n = null) && Ae(t.prototype, n),
                r && Ae(t, r),
                e
        }();
        function Me(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        var Pe = function () {
            function e() {
                !function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            var t, n, r;
            return t = e,
                r = [{
                    key: "_routeChatToAgent",
                    value: function (e, t) {
                        console.log("_routeChatToAgent: " + JSON.stringify(t)),
                            e._callOnEvent("incommingchat", t)
                    }
                }],
                (n = null) && Me(t.prototype, n),
                r && Me(t, r),
                e
        }();
        function we(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        var De = function () {
            function e(t) {
                var n = this;
                !function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                    console.log("SSWS build: 19-08-2020 17:26"),
                    this.serverAddr = t,
                    this._onMethods = new StringeeHashMap,
                    this.userDisconnect = !1,
                    this.timeoutReconnectMethod = null,
                    this.socket = null,
                    this.serverAddressIsDead = !1,
                    this.alreadyTried = !1;
                var r = this;
                this.healthCheckInterval = setInterval((function () {
                    r.serverAddressIsDead ? r.clearHealthCheckInterval() : !n.socket || n.socket.readyState !== WebSocket.CLOSED && n.socket.readyState !== WebSocket.CLOSING || (n.alreadyTried = !1,
                        r.connect())
                }
                ), 2e3)
            }
            var t, n, r;
            return t = e,
                (n = [{
                    key: "clearHealthCheckInterval",
                    value: function () {
                        try {
                            clearInterval(this.healthCheckInterval)
                        } catch (e) {
                            console.log("clearing health check interval inside SSWS failed", e)
                        }
                    }
                }, {
                    key: "open",
                    value: function () {
                        this.connect()
                    }
                }, {
                    key: "connect",
                    value: function () {
                        this.alreadyTried ? console.log("SSWS: already tried, wait for 3 seconds") : (this.alreadyTried = !0,
                            this.userDisconnect = !1,
                            this.socket && (this.socket.onopen = null,
                                this.socket.onmessage = null,
                                this.socket.onclose = null,
                                this.socket.onerror = null,
                                this.socket.close(),
                                this.socket = null),
                            this.socket = new WebSocket(this.serverAddr),
                            this.bindSocketEvents(this.socket))
                    }
                }, {
                    key: "bindSocketEvents",
                    value: function (e) {
                        var t = this;
                        e.onopen = function (e) {
                            var n = t._onMethods.get("connect");
                            n && n(e)
                        }
                            ,
                            e.onmessage = function (e) {
                                var n = t._onMethods.get("EventPacket");
                                n && n(e.data)
                            }
                            ,
                            e.onclose = function (e) {
                                var n = t._onMethods.get("disconnect");
                                n && n(e)
                            }
                            ,
                            e.onerror = function (n) {
                                console.log("Native websocket error", n),
                                    this.serverAddressIsDead = !0,
                                    t.clearHealthCheckInterval();
                                var r = t._onMethods.get("error");
                                r ? r(n) : console.log("StringeeWebSocket on error", n),
                                    e.close()
                            }
                    }
                }, {
                    key: "reconnect",
                    value: function () {
                        console.log("SSWS: on reconnect"),
                            this.disconnect();
                        var e = this;
                        this.userCallReconnectMethod && clearTimeout(this.userCallReconnectMethod),
                            this.userCallReconnectMethod = setTimeout((function () {
                                e.connect()
                            }
                            ), 1e3)
                    }
                }, {
                    key: "disconnect",
                    value: function () {
                        this.clearHealthCheckInterval(),
                            this.userDisconnect = !0,
                            this.timeoutReconnectMethod && clearTimeout(this.timeoutReconnectMethod),
                            this.socket.close()
                    }
                }, {
                    key: "close",
                    value: function () {
                        this.disconnect()
                    }
                }, {
                    key: "on",
                    value: function (e, t) {
                        this._onMethods.put(e, t)
                    }
                }, {
                    key: "send",
                    value: function (e) {
                        if (this.socket.readyState === WebSocket.OPEN) {
                            var t = JSON.stringify(e);
                            this.socket.send(t)
                        } else
                            console.log("Socket is not open. not sending anything", this.socket.readyState)
                    }
                }, {
                    key: "emit",
                    value: function (e, t) {
                        this.send(t)
                    }
                }]) && we(t.prototype, n),
                r && we(t, r),
                e
        }();
        function Ne(e) {
            return function (e) {
                if (Array.isArray(e))
                    return Le(e)
            }(e) || function (e) {
                if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
                    return Array.from(e)
            }(e) || function (e, t) {
                if (!e)
                    return;
                if ("string" == typeof e)
                    return Le(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === n && e.constructor && (n = e.constructor.name);
                if ("Map" === n || "Set" === n)
                    return Array.from(n);
                if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                    return Le(e, t)
            }(e) || function () {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }
        function Le(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var n = 0, r = new Array(t); n < t; n++)
                r[n] = e[n];
            return r
        }
        function Fe(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        function Ve(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        var xe = function () {
            function e() {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ["wss://v1.stringee.com:6899/", "wss://v2.stringee.com:6899/"];
                Fe(this, e),
                    this.socket = null,
                    this.hasConnected = !1,
                    this.disconnectByUser = !1,
                    this.timeoutToReconnect = 0,
                    this.lastTimeStampReceivedPacket = 0,
                    this.allClients = [],
                    this.allClientsOfThisBrowser = [],
                    this.masterServer = null,
                    this.stringeeServerAddrs = t,
                    this.stringeeServerAddrIndex = -1,
                    this._stringeeServerAddr = this.stringeeServerAddrs[0],
                    this._currentRequestId = 1,
                    this._callbacks = new l,
                    this.accessToken = "",
                    this._onMethods = new l,
                    this._stringeeCalls = [],
                    this._stringeeCalls2 = [],
                    this.ice_servers = [],
                    this.deviceId = "web-" + this._genUuid(),
                    this.browserId = localStorage.getItem("stringee_browser_id"),
                    this.browserId || (this.browserId = "browser-" + this._genUuid(),
                        localStorage.setItem("stringee_browser_id", this.browserId)),
                    this.sessionId = "session-" + this._genUuid(),
                    this.alreadyTried = !1;
                var n = this;
                this.healtcheckInterval = setInterval((function () {
                    return n.alreadyTried && (n.alreadyTried = !1),
                        n.disconnectByUser ? (console.log("StringeeClient: Socket disconnected by user. Stop trying to connect"),
                            void n._cleanHouse()) : null == n.socket ? (console.log("StringeeClient: Socket is null"),
                                void (n.accessToken && (console.log("StringeeClient: create a new socket", n.socket),
                                    n.createNewStringeeWebSocket(n.accessToken)))) : void (n.socket && n.socket.socket && n.socket.socket.readyState > 1 && n.accessToken && (console.log("StringeeClient: Socket is closed or about to close, create a new socket instance", n.socket.socket.readyState, n._stringeeServerAddr),
                                        n.createNewStringeeWebSocket(n.accessToken)))
                }
                ), 1e4)
            }
            var t, n, r;
            return t = e,
                (n = [{
                    key: "_cleanHouse",
                    value: function () {
                        this.healtcheckInterval && clearInterval(this.healtcheckInterval)
                    }
                }, {
                    key: "getClientId",
                    value: function () {
                        return this.deviceId
                    }
                }, {
                    key: "getBrowserId",
                    value: function () {
                        return this.browserId
                    }
                }, {
                    key: "setThisClientIsActive",
                    value: function (e) {
                        e ? localStorage.setItem("active_client_id", this.deviceId) : localStorage.removeItem("active_client_id")
                    }
                }, {
                    key: "isActiveClient",
                    value: function () {
                        var e = localStorage.getItem("active_client_id");
                        return this.deviceId === e
                    }
                }, {
                    key: "findCallByCallId",
                    value: function (e) {
                        for (var t = 0; t < this._stringeeCalls.length; t++) {
                            var n = this._stringeeCalls[t];
                            if (n.callId === e)
                                return n
                        }
                        return null
                    }
                }, {
                    key: "findCall2ByCallId",
                    value: function (e) {
                        for (var t = 0; t < this._stringeeCalls2.length; t++) {
                            var n = this._stringeeCalls2[t];
                            if (n.callId === e)
                                return n
                        }
                        return null
                    }
                }, {
                    key: "_pushCallback",
                    value: function (e, t) {
                        if (t) {
                            var n = this._callbacks.get(e);
                            n || (n = []),
                                n.push(t),
                                this._callbacks.put(e, n)
                        }
                    }
                }, {
                    key: "_callCallback",
                    value: function (e, t) {
                        var n = !1
                            , r = this._callbacks.get(e);
                        if (r) {
                            var i = r.pop();
                            i && (i.call(this, t),
                                n = !0)
                        }
                        return n
                    }
                }, {
                    key: "getURLToConnect",
                    value: function () {
                        if (null !== this.masterServer) {
                            console.log("Master server is set ", this.masterServer, ". Stop alternating to other server");
                            var e = this.masterServer;
                            return this.masterServer = null,
                                e
                        }
                        return this.tempWebsocketURL && 0 !== this.tempWebsocketURL.length || (this.tempWebsocketURL = Ne(this.stringeeServerAddrs)),
                            this.tempWebsocketURL.shift()
                    }
                }, {
                    key: "createNewStringeeWebSocket",
                    value: function (e) {
                        console.log("createNewStringeeWebSocket ", e),
                            this._stringeeServerAddr = this.getURLToConnect();
                        try {
                            this.socket && (console.log("StringeeClient: clear socket interval before creating new instance"),
                                this.socket.clearHealthCheckInterval())
                        } catch (e) {
                            console.log("failed clearing interval of StringeeWebSocket", e)
                        }
                        this.socket = null,
                            this.socket = new De(this._stringeeServerAddr),
                            this.bindSocketEvents(this.socket, e),
                            this.accessToken = e,
                            this.socket.open()
                    }
                }, {
                    key: "bindSocketEvents",
                    value: function (e, t) {
                        var n = this;
                        e.on("connect", (function () {
                            n._callOnEvent("connect"),
                                n.numberOfRetryConnect = 0;
                            var e = screen.width
                                , r = screen.height
                                , i = localStorage.getItem("stringee_browser_id");
                            i || (i = "browser-" + n._genUuid(),
                                localStorage.setItem("stringee_browser_id", i));
                            var o = {
                                accesstoken: t,
                                deviceId: n.deviceId,
                                browserId: n.browserId,
                                sessionId: n.sessionId,
                                platform: 3,
                                platformVersion: "",
                                deviceName: navigator.userAgent,
                                screenSize: e + "x" + r,
                                sdkVersion: "2.6.0"
                            };
                            n._sendMessage(c.AUTHEN, o, (function (e) {
                                0 === e.r ? (n.ice_servers = e.ice_servers,
                                    n.hasConnected = !0,
                                    e.clients.forEach((function (e) {
                                        n.allClients.push(e.clientId),
                                            e.browserId === n.getBrowserId() && n.allClientsOfThisBrowser.push(e.clientId),
                                            n.allClients.sort(),
                                            n.allClientsOfThisBrowser.sort()
                                    }
                                    )),
                                    n.userId = e.userId,
                                    n.timeoutToReconnect = e.ping_after_ms + 15e3) : n.hasConnected = !1,
                                    15 !== e.r ? (n._callOnEvent("authen", e),
                                        6 === e.r && n._callOnEvent("requestnewtoken")) : (console.log("CURRENT_SERVER_IS_SLAVE, please change to: " + e.change_to_server),
                                            e.change_to_server ? (n.masterServer = e.change_to_server,
                                                n.socket.disconnect(),
                                                n.alreadyTried = !1,
                                                n.connect(n.accessToken)) : setTimeout((function () {
                                                    n.socket.disconnect()
                                                }
                                                ), 2e3))
                            }
                            ))
                        }
                        )),
                            e.on("disconnect", (function () {
                                n.hasConnected = !1,
                                    n._callOnEvent("disconnect")
                            }
                            )),
                            e.on("error", (function (e) {
                                console.log("socket error", e)
                            }
                            )),
                            e.on("EventPacket", (function (e) {
                                try {
                                    var t = JSON.parse(e);
                                    if (!t || !t.service)
                                        return void console.log("could not decode data, error=1, ", e);
                                    try {
                                        n._packetReceived(t.service, t.body)
                                    } catch (e) {
                                        console.log("error when process packet", e)
                                    }
                                } catch (t) {
                                    console.log("could not decode data, error=2, ", e)
                                }
                            }
                            ))
                    }
                }, {
                    key: "connect",
                    value: function (e) {
                        this.alreadyTried ? console.log("StringeeClient: There is a recent attempt to connect to " + this._stringeeServerAddr + ". Please wait") : (this.alreadyTried = !0,
                            this.disconnectByUser = !1,
                            this.socket && (this.socket.disconnect(),
                                this.socket = null),
                            this.createNewStringeeWebSocket(e))
                    }
                }, {
                    key: "disconnect",
                    value: function () {
                        console.log("StringeeClient: disconnected by user"),
                            this.alreadyTried = !1,
                            this.tempWebsocketURL = null,
                            this.disconnectByUser = !0,
                            this.socket && (this.socket.close(),
                                this.socket = null)
                    }
                }, {
                    key: "sendCustomMessage",
                    value: function (e, t, n) {
                        var r = this
                            , i = {
                                toUser: e,
                                message: t
                            };
                        this._sendMessage(c.CUSTOM_MESSAGE, i, (function (e) {
                            n && n.call(r, e)
                        }
                        ))
                    }
                }, {
                    key: "changeAttribute",
                    value: function (e, t, n) {
                        var r = this
                            , i = {
                                attribute: e,
                                value: t
                            };
                        this._sendMessage(c.CHANGE_ATTRIBUTE, i, (function (e) {
                            n && n.call(r, e)
                        }
                        ))
                    }
                }, {
                    key: "_sendMessage",
                    value: function (e, t, n) {
                        if (t.requestId || (t.requestId = this._currentRequestId),
                            n) {
                            var r = "packet_" + e + "_" + t.requestId;
                            this._pushCallback(r, n)
                        }
                        var i = {
                            service: e,
                            body: t
                        };
                        this.socket.emit("EventPacket", i),
                            this._currentRequestId++
                    }
                }, {
                    //Nhận message
                    key: "_packetReceived",
                    value: function (e, t) {
                        var n, r = !1;
                        if (this.lastTimeStampReceivedPacket = Date.now(),
                            t.requestId) {
                            var i = "packet_" + e + "_" + t.requestId;
                            n = this._callCallback(i, t)
                        }
                        e === c.CALL_SDP_CANDIDATE_FROM_SERVER ? be._callSdpCandidateFromServer(this, t) : e === c.CALL_STATE_FROM_SERVER ? be._callStateFromServer(this, t) : e === c.CALL_STOP_FROM_SERVER ? be._callStopFromServer(this, t) : e === c.CALL_START_FROM_SERVER ? be._callStartFromServer(this, t) : e === c.PING ? this._sendMessage(c.PING, {}) : e === c.CALL_INFO_FROM_SERVER ? be._callInfoFromServer(this, t) : e === c.MSG_FROM_OTHER_DEVICE ? this._msgFromOtherDevice(t) : e === c.CUSTOM_MESSAGE_FROM_SERVER ? this._callOnEvent("custommessage", t) : e === c.OTHER_DEVICE_AUTHEN ? this._otherDeviceAuthen(t) : e === c.CHAT_MESSAGE_FROM_SERVER ? this._callOnEvent("chatmessage", t) : e === c.CHAT_MESSAGE_REPORT_FROM_SERVER ? this._callOnEvent("chatmessagestate", t) : e === c.CHAT_ROUTE_TO_AGENT ? Pe._routeChatToAgent(this, t) : e === c.SUBSCRIBE_FROM_SERVER ? this._callOnEvent("messagefromtopic", t) : e === c.TIMEOUT_ROUTE_TO_QUEUE ? this._callOnEvent("timeoutInQueue", t) : e === c.TIMEOUT_ROUTE_TO_AGENT ? this._callOnEvent("timeoutAnswerChat", t) : e === c.CHAT_PIN_MESSAGE_FROM_SERVER ? this._callOnEvent("pinMsgFromServer", t) : e === c.CHAT_EDIT_MESSAGE_FROM_SERVER ? this._callOnEvent("editMsgFromServer", t) : e === c.CHAT_REVOKE_MESSAGE_FROM_SERVER ? this._callOnEvent("revokeMsgFromServer", t) : e === c.CHAT_REMOVE_PARTICIPANT_FROM_SERVER ? this._callOnEvent("removeParticipantFromServer", t) : e === c.CHAT_ADD_PARTICIPANT_FROM_SERVER ? this._callOnEvent("addParticipantFromServer", t) : e === c.CHAT_USER_BEGIN_TYPING_NOTIFICATION ? this._callOnEvent("userBeginTypingListener", t) : e === c.CHAT_USER_END_TYPING_NOTIFIACTION ? this._callOnEvent("userEndTypingListener", t) : e === c.UPDATE_USER_INFO_NOTIFICATION ? this._callOnEvent("updateUserInfoMsg", t) : e === c.CHAT_CONVERSATION_ATTACHMENT ? this._callOnEvent("chatConversationAttachment", t) : e === c.CHAT_AGENT_RESPONSE ? this._callOnEvent("chatAgentResponse", t) : e === c.END_CHAT ? this._callOnEvent("endChat", t) : e === c.CHAT_TRANSFER_REQUEST_FROM_ANOTHER_AGENT ? this._callOnEvent("transferChatRequest", t) : e === c.CHAT_LOAD_ALL_MESSAGES_FOR_CONVERSATIONS ? this._callOnEvent("loadAllChatMessages", t) : e === c.VIDEO_ENDPOINT_SDP_FROM_SERVER ? be._videoEndPointSdpFromServer(this, t) : e === c.VIDEO_ENDPOINT_CANDIDATE_FROM_SERVER ? be._videoEndPointCandidateFromServer(this, t) : e === c.VIDEO_TRACK_ADDED_FROM_SERVER ? be._videoTrackAddedFromServer(this, t) : e === c.VIDEO_TRACK_REMOVED_FROM_SERVER ? be._videoTrackRemovedFromServer(this, t) : e === c.VIDEO_ROOM_JOINED_FROM_SERVER ? be._videoRoomJoinedFromServer(this, t) : e === c.VIDEO_ROOM_LEFT_FROM_SERVER ? be._videoRoomLeftFromServer(this, t) : e === c.VIDEO_ROOM_MSG_FROM_SERVER ? be._videoRoomMsgFromServer(this, t) : e === c.VIDEO_ROOM_CALL_INVITE ? be._videoRoomCallInviteFromServer(this, t) : e === c.VIDEO_ROOM_CALL_INVITE_CANCEL ? be._videoRoomCallInviteCancelFromServer(this, t) : e === c.VIDEO_ROOM_CALL_STATE_FROM_SERVER ? be._call2StateFromServer(this, t) : e === c.VIDEO_ROOM_END_CALL_FROM_SERVER ? be._call2EndFromServer(this, t) : r = !0,
                            n && (r = !1),
                            r && console.log("===Packet received: service=" + e + "; body=" + JSON.stringify(t))
                        r && console.log("Da nhan duoc message")
                        r && receiveMessage(t.msg);
                    }
                }, {
                    key: "_otherDeviceAuthen",
                    value: function (e) {
                        if ("disconnected" === e.status) {
                            for (var t = 0; t < this.allClients.length; t++)
                                this.allClients[t] === e.clientId && this.allClients.splice(t, 1);
                            if (e.browserId === this.getBrowserId())
                                for (t = 0; t < this.allClientsOfThisBrowser.length; t++)
                                    this.allClientsOfThisBrowser[t] === e.clientId && this.allClientsOfThisBrowser.splice(t, 1)
                        } else
                            this.allClients.push(e.clientId),
                                e.browserId === this.getBrowserId() && this.allClientsOfThisBrowser.push(e.clientId),
                                this.allClients.sort(),
                                this.allClientsOfThisBrowser.sort();
                        this._callOnEvent("otherdeviceauthen", e)
                    }
                }, {
                    key: "_msgFromOtherDevice",
                    value: function (e) {
                        var t = e.data;
                        if ("CALL_STATE" === e.type)
                            (n = this.findCallByCallId(t.callId)) && (200 === t.code && (n.answeredOnAnotherDevice = !0),
                                n._callOnEvent("otherdevice", {
                                    type: "CALL_STATE",
                                    code: t.code
                                }),
                                486 === t.code || 603 === t.code ? (n.ended = !0,
                                    n._freeResource(),
                                    n.onRemove()) : 200 === t.code && n._freeResource());
                        else if ("CALL_END" === e.type)
                            (n = this.findCallByCallId(t.callId)) && (n.ended = !0,
                                n._callOnEvent("otherdevice", {
                                    type: "CALL_END"
                                }));
                        else if ("CALL2_STATE" === e.type) {
                            var n;
                            (n = this.findCall2ByCallId(t.callId)) && (200 === t.code && (n.answeredOnAnotherDevice = !0),
                                n._callOnEvent("otherdevice", {
                                    type: "CALL2_STATE",
                                    code: t.code
                                }),
                                486 === t.code || 603 === t.code ? (n.ended = !0,
                                    n.onRemove()) : 200 === t.code && (n.isAnswered = !0,
                                        n.onRemove()))
                        } else
                            console.log("===_msgFromOtherDevice: body=" + JSON.stringify(e))
                    }
                }, {
                    key: "sendChatOneToOneMsg",
                    value: function () { }
                }, {
                    key: "on",
                    value: function (e, t) {
                        this._onMethods.put(e, t)
                    }
                }, {
                    key: "_callOnEvent",
                    value: function (e, t) {
                        var n = this._onMethods.get(e);
                        n ? t ? n.call(this, t) : n.call(this) : console.log("Please implement StringeeClient event: " + e)
                    }
                }, {
                    key: "_genUuid",
                    value: function () {
                        function e() {
                            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
                        }
                        return e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e()
                    }
                }]) && Ve(t.prototype, n),
                r && Ve(t, r),
                e
        }()
            , Ge = 0
            , Ue = 1;
        var je = function e(t, n, r, i) {
            !function (e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function")
            }(this, e),
                this.id = t,
                this.userId = n,
                this.body = r,
                this.callback = i,
                this.expireTime = Date.now() + 36e5
        }
            , He = 0
            , Be = 1
            , qe = 2
            , Ke = 0
            , Je = 1
            , We = 2
            , ze = 3
            , Qe = 4;
        var Ye = function e(t, n, r, i, o) {
            !function (e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function")
            }(this, e),
                0 === n ? (this.id = t.id,
                    this.localId = t.localDbId,
                    this.conversationId = t.convId,
                    this.sender = t.user,
                    this.createdAt = t.created,
                    this.sequence = t.seq,
                    this.type = t.type,
                    this.content = t.content,
                    i >= t.seq ? this.state = Qe : r >= t.seq ? this.state = ze : this.state = We) : 1 === n ? (this.id = t.msgId,
                        this.localId = t.localDbId,
                        this.conversationId = t.convId,
                        this.sender = t.from,
                        this.createdAt = t.createdTime,
                        this.sequence = t.seq,
                        this.type = t.type,
                        this.content = t.message,
                        this.state = ze) : 2 === n ? (this.id = t.msgId,
                            this.conversationId = t.convId,
                            this.createdAt = t.created,
                            this.sequence = t.seq,
                            this.state = We) : 3 == n && (0 == o ? (this.id = t.lastMsg.id,
                                this.localId = "",
                                this.conversationId = t.convId,
                                this.sender = t.lastMsg.user,
                                this.createdAt = t.lastMsg.created,
                                this.sequence = 1,
                                this.type = t.lastMsg.type,
                                this.content = t.lastMsg.content,
                                this.state = Qe) : 1 == o ? (this.id = null != t.lastMsgId ? t.lastMsgId : "",
                                    this.localId = "",
                                    this.conversationId = t.convId,
                                    this.sender = t.lastMsgSender,
                                    this.createdAt = t.lastTimeNewMsg,
                                    this.sequence = t.lastMsgSeqReceived,
                                    this.type = t.lastMsgType,
                                    this.content = t.lastMsg,
                                    t.lastMsgSeqReceived > t.lastMsgSeqSeen ? this.state = ze : this.state = Qe) : 2 == o && (this.id = null != t.lastMsgId ? t.lastMsgId : "",
                                        this.localId = "",
                                        this.conversationId = t.convId,
                                        this.sender = null != t.lastMsgSender ? t.lastMsgSender : "",
                                        this.createdAt = t.lastTimeNewMsg,
                                        this.sequence = t.lastMsgSeqReceived,
                                        this.type = t.lastMsgType,
                                        this.content = t.lastMsg,
                                        t.lastMsgSeqReceived > t.lastMsgSeqSeen ? this.state = ze : this.state = Qe))
        };
        var Xe = function e(t) {
            !function (e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function")
            }(this, e),
                this.userId = t.user,
                this.name = t.displayName,
                this.avatar = t.avatarUrl,
                null != t.lastMsgSeqReceived && (this.lastMsgSeqReceived = t.lastMsgSeqReceived),
                null != t.lastMsgSeqSeen && (this.lastMsgSeqSeen = t.lastMsgSeqSeen)
        };
        var $e = function e(t, n) {
            if (function (e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function")
            }(this, e),
                0 === n) {
                this.id = t.convId,
                    this.name = t.lastMsg.content.groupName,
                    this.isGroup = t.isGroup,
                    this.updatedAt = t.lastUpdate,
                    this.unreadCount = 0,
                    this.creator = t.lastMsg.content.creator,
                    this.created = t.lastTimeNewMsg,
                    this.pinMsgId = t.pinMsgId;
                var r = [];
                t.participants.forEach((function (e) {
                    var t = new Xe(e);
                    r.push(t)
                }
                )),
                    this.participants = r,
                    this.lastMessage = new Ye(t, 3, 0, 0, n)
            } else if (1 === n) {
                this.id = t.convId,
                    this.name = t.convName,
                    this.isGroup = t.isGroup,
                    this.updatedAt = t.lastUpdate,
                    this.unreadCount = t.unread,
                    this.creator = t.creator,
                    this.created = t.created,
                    this.pinMsgId = t.pinMsgId;
                r = [];
                t.participants.forEach((function (e) {
                    var t = new Xe(e);
                    r.push(t)
                }
                )),
                    this.participants = r,
                    this.lastMessage = new Ye(t, 3, 0, 0, n)
            } else {
                this.id = t.convId,
                    this.name = t.info.name,
                    this.isGroup = t.info.isGroup,
                    this.updatedAt = t.lastUpdate,
                    this.unreadCount = 0,
                    this.creator = t.info.creator,
                    this.created = t.info.created,
                    this.pinMsgId = t.pinMsgId;
                r = [];
                t.participants.forEach((function (e) {
                    var t = new Xe(e);
                    r.push(t)
                }
                )),
                    this.participants = r,
                    this.lastMessage = new Ye(t, 3, 0, 0, n)
            }
        };
        function Ze(e) {
            return (Ze = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            }
                : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }
            )(e)
        }
        function et(e, t) {
            var n = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var r = Object.getOwnPropertySymbols(e);
                t && (r = r.filter((function (t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                }
                ))),
                    n.push.apply(n, r)
            }
            return n
        }
        function tt(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = null != arguments[t] ? arguments[t] : {};
                t % 2 ? et(Object(n), !0).forEach((function (t) {
                    nt(e, t, n[t])
                }
                )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : et(Object(n)).forEach((function (t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                }
                ))
            }
            return e
        }
        function nt(e, t, n) {
            return t in e ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = n,
                e
        }
        function rt(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        var it = function () {
            function e(t) {
                !function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e);
                var n = this;
                n.realTimeEvent = "onObjectChange",
                    n.pinMsgFromServerEvent = "pinMsgFromServer",
                    n.editMsgFromServerEvent = "editMsgFromServer",
                    n.userBeginTypingEvent = "userBeginTypingListener",
                    n.userEndTypingEvent = "userEndTypingListener",
                    n.revokeMsgFromServerEvent = "revokeMsgFromServer",
                    n.removeParticipantFromServerEvent = "removeParticipantFromServer",
                    n.addParticipantFromServerEvent = "addParticipantFromServer",
                    n.created = !1,
                    n.client = t,
                    n._onMethods = new l,
                    n.trackingMap = new l,
                    n.msgQueue = [],
                    setInterval((function () {
                        var e = Date.now();
                        n.msgQueue = n.msgQueue.filter((function (t) {
                            return t.expireTime > e
                        }
                        ))
                    }
                    ), 1e3),
                    n.setupChatClient(n)
            }
            var t, n, r;
            return t = e,
                (n = [{
                    key: "setupChatClient",
                    value: function (e) {
                        e.client.on("authensuccess", (function (t) {
                            e.sendMessageQueue()
                        }
                        )),
                            e.client.on("chatmessage", (function (t) {
                                var n = new Ye(t, 1)
                                    , r = {
                                        lastMsgSeq: n.sequence,
                                        lastMsgTimestamp: n.createdAt,
                                        status: 1,
                                        convId: n.conversationId
                                    };
                                e.client._sendMessage(c.CHAT_MESSAGE_REPORT, r, (function (e) { }
                                )),
                                    e.trackMsg(n),
                                    e.fireObjectChangeEvent(Ue, [n], He),
                                    null != n.conversationId && n.conversationId.length > 0 && e.getConversationById(n.conversationId, (function (t, n, r, i) {
                                        t && null != i && e.fireObjectChangeEvent(Ge, [i], Be)
                                    }
                                    ))
                            }
                            )),
                            e.client.on("chatmessagestate", (function (t) {
                                var n = t.lastMsgSeq
                                    , r = t.status
                                    , i = (t.convId,
                                        e.trackingMap.allValues())
                                    , o = [];
                                i.forEach((function (t) {
                                    if (n >= t.sequence)
                                        if (2 === r) {
                                            t.state = Qe,
                                                o.push(t);
                                            var i = e.keyForMsg(t);
                                            e.trackingMap.remove(i)
                                        } else
                                            1 === r && t.state !== Qe && t.state !== ze && (t.state = ze,
                                                o.push(t))
                                }
                                )),
                                    o.length > 0 && e.fireObjectChangeEvent(Ue, o, Be)
                            }
                            )),
                            e.client.on("pinMsgFromServer", (function (t) {
                                var n = t.convId
                                    , r = t.msgId
                                    , i = t.isPin;
                                e._callOnEvent(e.pinMsgFromServerEvent, {
                                    convId: n,
                                    msgId: r,
                                    isPin: i
                                })
                            }
                            )),
                            e.client.on("editMsgFromServer", (function (t) {
                                var n = t.convId
                                    , r = t.msgId;
                                e._callOnEvent(e.editMsgFromServerEvent, {
                                    convId: n,
                                    msgId: r
                                })
                            }
                            )),
                            e.client.on("revokeMsgFromServer", (function (t) {
                                var n = t.convId
                                    , r = t.msgIds;
                                e._callOnEvent(e.revokeMsgFromServerEvent, {
                                    convId: n,
                                    msgIds: r
                                })
                            }
                            )),
                            e.client.on("userBeginTypingListener", (function (t) {
                                e._callOnEvent(e.userBeginTypingEvent, t)
                            }
                            )),
                            e.client.on("userEndTypingListener", (function (t) {
                                e._callOnEvent(e.userEndTypingEvent, t)
                            }
                            )),
                            e.client.on(e.removeParticipantFromServerEvent, (function (t) {
                                e._callOnEvent(e.removeParticipantFromServerEvent, t)
                            }
                            )),
                            e.client.on(e.addParticipantFromServerEvent, (function (t) {
                                e._callOnEvent(e.addParticipantFromServerEvent, t)
                            }
                            ))
                    }
                }, {
                    key: "createConversation",
                    value: function (e, t, n) {
                        var r = this;
                        return new Promise((function (i, o) {
                            if (r.created)
                                o({
                                    r: -1,
                                    message: "Could not create conversation, conversation is created"
                                });
                            else {
                                if (console.log("continue to chat...1"),
                                    void 0 === e || null == e || null == e.length || 0 === e.length)
                                    return o({
                                        r: -1,
                                        message: "UserIds are invalid"
                                    }),
                                        void n.call(r.client, !1, -2, "UserIds are invalid", null);
                                if (!r.client.hasConnected)
                                    return o({
                                        r: -1,
                                        message: "StringeeClient is not connected to Stringee server."
                                    }),
                                        void n.call(r.client, !1, -1, "StringeeClient is not connected to Stringee server.", null);
                                var a;
                                a = null == t.name || 0 === t.name.length ? "" : t.name;
                                var s = {
                                    distinct: t.isDistinct,
                                    isGroup: t.isGroup,
                                    name: a,
                                    participants: e
                                };
                                r.client._sendMessage(c.CHAT_CREATE_CONVERSATION, s, (function (e) {
                                    var t = e.r
                                        , a = 0 === t || 2 === t;
                                    a && (r.created = !0);
                                    var s = a ? "Success" : null != e.message && e.message.length > 0 ? e.message : "Generic error."
                                        , c = a ? new $e(e, t) : null
                                        , l = 0 === t || 2 === t ? 0 : e.r;
                                    n && n.call(r.client, a, l, s, c),
                                        a || o(t),
                                        0 === e.r ? (e.objectType = Ge,
                                            e.objectChanges = [c],
                                            e.changeType = He,
                                            i(e),
                                            console.log("firing r === 0"),
                                            r.fireObjectChangeEvent(Ge, [c], He)) : 2 === e.r && (console.log("firing r === 2"),
                                                e.objectType = Ge,
                                                e.objectChanges = [c],
                                                e.changeType = Be,
                                                i(e),
                                                r.fireObjectChangeEvent(Ge, [c], Be))
                                }
                                ))
                            }
                        }
                        ))
                    }
                }, {
                    key: "getLastConversations",
                    value: function (e, t, n) {
                        var r = this;
                        if (e <= 0)
                            n.call(r.client, !1, -2, "Params are invalid.", null);
                        else if (r.client.hasConnected) {
                            var i = {
                                lastUpdateGreater: 0,
                                lastUpdateSmaller: Number.MAX_SAFE_INTEGER,
                                limit: e
                            };
                            r.client._sendMessage(c.CHAT_CONVERSATION_LOAD, i, (function (e) {
                                if (n) {
                                    var i = 0 === e.r
                                        , o = e.r
                                        , a = i ? "Success" : null != e.message && e.message.length > 0 ? e.message : "Generic error."
                                        , s = e.listConvs;
                                    return null != s && (s = t ? s.reverse().map((function (e) {
                                        return new $e(e, 1)
                                    }
                                    )) : s.map((function (e) {
                                        return new $e(e, 1)
                                    }
                                    ))),
                                        void n.call(r.client, i, o, a, s)
                                }
                            }
                            ))
                        } else
                            n.call(r.client, !1, -1, "StringeeClient is not connected to Stringee server.", null)
                    }
                }, {
                    key: "getConversationsAfter",
                    value: function (e, t, n, r) {
                        var i = this;
                        if (t <= 0 || e <= 0)
                            r.call(i.client, !1, -2, "Params are invalid.", null);
                        else if (i.client.hasConnected) {
                            var o = {
                                lastUpdateGreater: e,
                                lastUpdateSmaller: Number.MAX_SAFE_INTEGER,
                                limit: t
                            };
                            i.client._sendMessage(c.CHAT_CONVERSATION_LOAD, o, (function (e) {
                                if (r) {
                                    var t = 0 === e.r
                                        , o = e.r
                                        , a = t ? "Success" : null != e.message && e.message.length > 0 ? e.message : "Generic error."
                                        , s = e.listConvs;
                                    return null != s && (s = n ? s.reverse().map((function (e) {
                                        return new $e(e, 1)
                                    }
                                    )) : s.map((function (e) {
                                        return new $e(e, 1)
                                    }
                                    ))),
                                        void r.call(i.client, t, o, a, s)
                                }
                            }
                            ))
                        } else
                            r.call(i.client, !1, -1, "StringeeClient is not connected to Stringee server.", null)
                    }
                }, {
                    key: "getConversationsBefore",
                    value: function (e, t, n, r) {
                        var i = this;
                        if (t <= 0 || e <= 0)
                            r.call(i.client, !1, -2, "Params are invalid.", null);
                        else if (i.client.hasConnected) {
                            var o = {
                                lastUpdateGreater: 0,
                                lastUpdateSmaller: e,
                                limit: t
                            };
                            i.client._sendMessage(c.CHAT_CONVERSATION_LOAD, o, (function (e) {
                                if (r) {
                                    var t = 0 === e.r
                                        , o = e.r
                                        , a = t ? "Success" : null != e.message && e.message.length > 0 ? e.message : "Generic error."
                                        , s = e.listConvs;
                                    return null != s && (s = n ? s.reverse().map((function (e) {
                                        return new $e(e, 1)
                                    }
                                    )) : s.map((function (e) {
                                        return new $e(e, 1)
                                    }
                                    ))),
                                        void r.call(i.client, t, o, a, s)
                                }
                            }
                            ))
                        } else
                            r.call(i.client, !1, -1, "StringeeClient is not connected to Stringee server.", null)
                    }
                }, {
                    key: "getConversationById",
                    value: function (e, t) {
                        var n = this;
                        return new Promise((function (r, i) {
                            if (!e)
                                return i({
                                    r: -1,
                                    message: "Conversaion's Id is invalid"
                                }),
                                    void t.call(n.client, !1, -2, "Conversaion's Id is invalid", conv);
                            if (!n.client.hasConnected)
                                return i({
                                    r: -1,
                                    message: "StringeeClient is not connected to Stringee server."
                                }),
                                    void t.call(n.client, !1, -2, "StringeeClient is not connected to Stringee server.", conv);
                            var o = {
                                convIds: e
                            };
                            n.client._sendMessage(c.CHAT_GET_CONVERSATIONS_INFO, o, (function (e) {
                                var o, a = e.r, s = 0 === a, c = e.r, l = s ? "Success" : null != e.message && e.message.length > 0 ? e.message : "Generic error.", d = e.listConvs;
                                null != d && d.length > 0 && (o = new $e(d[0], 1)),
                                    t && t.call(n.client, s, c, l, o),
                                    0 === a ? r(tt({}, e, {
                                        conversation: o
                                    })) : i(tt({}, e, {
                                        conversation: o
                                    }))
                            }
                            ))
                        }
                        ))
                    }
                }, {
                    key: "deleteConversation",
                    value: function (e, t) {
                        var n = this;
                        if (e)
                            if (n.client.hasConnected) {
                                var r = {
                                    convIds: e
                                };
                                n.client._sendMessage(c.CHAT_GET_CONVERSATIONS_INFO, r, (function (r) {
                                    if (t) {
                                        var i = r.listConvs;
                                        if (null != i && i.length > 0) {
                                            var o = i[0]
                                                , a = {
                                                    seq: o.convLastSeq,
                                                    convId: e
                                                };
                                            n.client._sendMessage(c.CHAT_DELETE_CONVERSATION, a, (function (e) {
                                                var r = e.r
                                                    , i = 0 === r
                                                    , a = r
                                                    , s = i ? "Success" : null != e.message && e.message.length > 0 ? e.message : "Generic error.";
                                                if (t.call(n.client, i, a, s),
                                                    0 === e.r) {
                                                    var c = new $e(o, 1);
                                                    n.fireObjectChangeEvent(Ge, [c], qe)
                                                }
                                            }
                                            ))
                                        } else
                                            t.call(n.client, !1, -3, "Can not get conversation's info")
                                    }
                                }
                                ))
                            } else
                                t.call(n.client, !1, -1, "StringeeClient is not connected to Stringee server.");
                        else
                            t.call(n.client, !1, -2, "Conversaion's Id is invalid")
                    }
                }, {
                    key: "updateConversation",
                    value: function (e, t, n) {
                        var r = this;
                        if (e)
                            if (r.client.hasConnected) {
                                var i = {
                                    convId: e,
                                    groupName: t.name,
                                    imageUrl: t.avatar
                                };
                                r.client._sendMessage(c.CHAT_UPDATE_CONVERSATION, i, (function (t) {
                                    if (n) {
                                        var i = 0 === t.r
                                            , o = t.r
                                            , a = i ? "Success" : null != t.message && t.message.length > 0 ? t.message : "Generic error.";
                                        n.call(r.client, i, o, a)
                                    }
                                    if (0 === t.r) {
                                        var s = {
                                            convIds: e
                                        };
                                        r.client._sendMessage(c.CHAT_GET_CONVERSATIONS_INFO, s, (function (e) {
                                            var t = e.listConvs;
                                            if (null != t && t.length > 0) {
                                                var n = t[0]
                                                    , i = new $e(n, 1);
                                                r.fireObjectChangeEvent(Ge, [i], Be)
                                            }
                                        }
                                        ))
                                    }
                                }
                                ))
                            } else
                                n.call(r.client, !1, -1, "StringeeClient is not connected to Stringee server.");
                        else
                            n.call(r.client, !1, -2, "Conversation's Id is invalid")
                    }
                }, {
                    key: "addParticipants",
                    value: function (e, t, n) {
                        var r = this;
                        return new Promise((function (i, o) {
                            if (!e)
                                return o({
                                    r: -1,
                                    message: "Conversation ID is invalid"
                                }),
                                    void n.call(r.client, !1, -2, "Params are invalid.", null);
                            if (!t || !t.length)
                                return o({
                                    r: -1,
                                    message: "List of users is empty"
                                }),
                                    void n.call(r.client, !1, -2, "Params are invalid.", null);
                            if (!r.client.hasConnected)
                                return o({
                                    r: -1,
                                    message: "StringeeClient is not connected to Stringee server."
                                }),
                                    void n.call(r.client, !1, -1, "StringeeClient is not connected to Stringee server.", null);
                            var a = {
                                convId: e,
                                userIds: t
                            };
                            r.client._sendMessage(c.CHAT_ADD_PARTICIPANT, a, (function (t) {
                                if (n) {
                                    var a = t.r
                                        , s = 0 === a
                                        , l = a
                                        , d = s ? "Success" : null != t.message && t.message.length > 0 ? t.message : "Generic error."
                                        , u = t.added;
                                    null != u && (u = u.map((function (e) {
                                        return new StringeeUser(e)
                                    }
                                    ))),
                                        n.call(r.client, s, l, d, u)
                                }
                                if (0 === t.r) {
                                    var p = {
                                        convIds: e
                                    };
                                    r.client._sendMessage(c.CHAT_GET_CONVERSATIONS_INFO, p, (function (e) {
                                        var t = e.listConvs;
                                        if (null != t && t.length > 0) {
                                            var n = t[0]
                                                , i = new $e(n, 1);
                                            r.fireObjectChangeEvent(Ge, [i], Be)
                                        }
                                    }
                                    )),
                                        i(t)
                                } else
                                    o(t)
                            }
                            ))
                        }
                        ))
                    }
                }, {
                    key: "removeParticipants",
                    value: function (e, t, n) {
                        var r = this;
                        return new Promise((function (i, o) {
                            if (!e)
                                return n.call(r.client, !1, -2, "Params are invalid.", null),
                                    void o({
                                        r: -1,
                                        message: "Conversation ID is not valid"
                                    });
                            if (!t || !t.length)
                                return n.call(r.client, !1, -2, "Params are invalid.", null),
                                    void o({
                                        r: -1,
                                        message: "list of user is empty"
                                    });
                            if (!r.client.hasConnected)
                                return n.call(r.client, !1, -1, "StringeeClient is not connected to Stringee server.", null),
                                    void o({
                                        r: -1,
                                        message: "StringeeClient is not connected to Stringee server."
                                    });
                            var a = {
                                convId: e,
                                userIds: t
                            };
                            r.client._sendMessage(c.CHAT_REMOVE_PARTICIPANT, a, (function (t) {
                                if (n) {
                                    var a = t.r
                                        , s = 0 === a
                                        , l = a
                                        , d = s ? "Success" : null != t.message && t.message.length > 0 ? t.message : "Generic error."
                                        , u = t.removed;
                                    null != u && (u = u.map((function (e) {
                                        return new StringeeUser(e)
                                    }
                                    ))),
                                        n.call(r.client, s, l, d, u)
                                }
                                if (0 === t.r) {
                                    var p = {
                                        convIds: e
                                    };
                                    r.client._sendMessage(c.CHAT_GET_CONVERSATIONS_INFO, p, (function (e) {
                                        var t = e.listConvs;
                                        if (null != t && t.length > 0) {
                                            var n = t[0]
                                                , i = new $e(n, 1);
                                            r.fireObjectChangeEvent(Ge, [i], Be)
                                        }
                                    }
                                    )),
                                        0 === t.r ? i(t) : o(t)
                                }
                            }
                            ))
                        }
                        ))
                    }
                }, {
                    key: "sendMessage",
                    value: function (e, t) {
                        var n = this;
                        if (e.convId)
                            if (n.client.hasConnected && null != n.client.userId) {
                                var r = n.client.userId
                                    , i = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
                                    , o = "web-" + r + "-" + i + "-" + Date.now().toString()
                                    , a = {
                                        message: e.message,
                                        type: e.type,
                                        convId: e.convId,
                                        localDbId: o
                                    }
                                    , s = new je(o, r, a, t);
                                n.msgQueue.push(s),
                                    console.log("start sending message");
                                var l = new Ye({}, 3);
                                l.id = null,
                                    l.localId = o,
                                    l.conversationId = e.convId,
                                    l.sender = r,
                                    l.createdAt = Date.now(),
                                    l.type = e.type,
                                    l.content = e.message,
                                    l.state = Ke,
                                    n.trackMsg(l),
                                    n.fireObjectChangeEvent(Ue, [l], He),
                                    l.state = Je,
                                    n.fireObjectChangeEvent(Ue, [l], Be),
                                    console.log("requesting send message"),
                                    n.client._sendMessage(c.CHAT_MESSAGE, a, (function (i) {
                                        console.log("on chat message sent", i);
                                        var a = i.r
                                            , s = 0 === a
                                            , c = null;
                                        if (t && 9 !== a) {
                                            var l = i.r
                                                , d = s ? "Success" : null != i.message && i.message.length > 0 ? i.message : "Generic error.";
                                            (c = new Ye(i, 2)).localId = o,
                                                c.type = e.type,
                                                c.content = e.message,
                                                c.sender = r,
                                                t.call(n.client, s, l, d, c)
                                        }
                                        var u = i.localDbId;
                                        if (null != u && s && (n.msgQueue = n.msgQueue.filter((function (e) {
                                            return e.id !== u
                                        }
                                        ))),
                                            null != c) {
                                            var p = n.keyForMsg(c);
                                            n.trackingMap.remove(p),
                                                n.trackingMap.put(p, c),
                                                n.fireObjectChangeEvent(Ue, [c], Be)
                                        }
                                    }
                                    ))
                            } else
                                t.call(n.client, !1, -1, "StringeeClient is not connected to Stringee server.");
                        else
                            t.call(n.client, !1, -2, "Conversation's Id is invalid")
                    }
                }, {
                    key: "sendMessageQueue",
                    value: function () {
                        var e = this;
                        if (e.msgQueue.length) {
                            var t = e.msgQueue[0];
                            if (t.userId != e.client.userId && null != e.client.userId)
                                return t.callback && t.callback.call(e.client, !1, -3, "Generic error.", null),
                                    void e.msgQueue.shift();
                            e.client._sendMessage(c.CHAT_MESSAGE, t.body, (function (n) {
                                var r = n.r
                                    , i = 0 == r
                                    , o = n.r
                                    , a = i ? "Success" : null != n.message && n.message.length > 0 ? n.message : "Generic error."
                                    , s = n.localDbId
                                    , c = null;
                                if (i && ((c = new Ye(n, 2)).localId = s,
                                    c.type = t.body.type,
                                    c.content = t.body.message,
                                    c.sender = t.userId),
                                    t.callback && 9 != r && t.callback.call(e.client, i, o, a, c),
                                    null != s && i && (e.msgQueue = e.msgQueue.filter((function (e) {
                                        return e.id != s
                                    }
                                    )),
                                        e.sendMessageQueue()),
                                    null != c) {
                                    var l = stringeeChat.keyForMsg(c);
                                    e.trackingMap.remove(l),
                                        e.trackingMap.put(l, c),
                                        e.fireObjectChangeEvent(Ue, [c], Be)
                                }
                            }
                            ))
                        }
                    }
                }, {
                    key: "loadChatMessages",
                    value: function (e, t) {
                        var n = this
                            , r = {
                                seqGreater: e.seqGreater,
                                limit: e.limit,
                                sort: e.sort,
                                convId: e.convId
                            };
                        n.client._sendMessage(c.CHAT_MESSAGES_LOAD, r, (function (e) {
                            t && t.call(n.client, e)
                        }
                        ))
                    }
                }, {
                    key: "loadAllChatMessages",
                    value: function (e, t) {
                        var n = this
                            , r = e.createdGreater
                            , i = e.createdSmaller
                            , o = e.limit
                            , a = e.sort
                            , s = e.convIds;
                        if (Array.isArray(s)) {
                            var l = {
                                createdGreater: r,
                                createdSmaller: i,
                                sort: a,
                                limit: o,
                                convIds: s = s.join(",")
                            };
                            return new Promise((function (e, r) {
                                n.client._sendMessage(c.CHAT_LOAD_ALL_MESSAGES_FOR_CONVERSATIONS, l, (function (r) {
                                    console.log("got data from server, ", r),
                                        t && (console.log("got a valid callback"),
                                            t.call(n.client, r)),
                                        e(r)
                                }
                                ))
                            }
                            ))
                        }
                        console.log("must be an array")
                    }
                }, {
                    key: "getLastMessages",
                    value: function (e, t, n, r) {
                        var i = this;
                        if (!e || t < 0)
                            r.call(i.client, !1, -2, "Params are invalid.", null);
                        else if (i.client.hasConnected) {
                            var o = null != t ? t : 50
                                , a = {
                                    seqGreater: 0,
                                    seqSmaller: Number.MAX_SAFE_INTEGER,
                                    limit: o,
                                    sort: "DESC",
                                    convId: e
                                };
                            i.client._sendMessage(c.CHAT_MESSAGES_LOAD, a, (function (t) {
                                if (r) {
                                    var o = 0 === t.r
                                        , a = t.r
                                        , s = o ? "Success" : null != t.message && t.message.length > 0 ? t.message : "Generic error."
                                        , l = t.msgs;
                                    if (null != l) {
                                        var d = {
                                            convIds: e
                                        };
                                        i.client._sendMessage(c.CHAT_GET_CONVERSATIONS_INFO, d, (function (e) {
                                            var t = e.listConvs
                                                , c = 0
                                                , d = 0;
                                            if (null != t && t.length > 0) {
                                                var u = t[0];
                                                c = u.lastMsgSeqReceived,
                                                    d = u.lastMsgSeqSeen
                                            }
                                            l = n ? l.reverse().map((function (e) {
                                                var t = new Ye(e, 0, c, d);
                                                return i.trackMsg(t),
                                                    t
                                            }
                                            )) : l.map((function (e) {
                                                var t = new Ye(e, 0, c, d);
                                                return i.trackMsg(t),
                                                    t
                                            }
                                            )),
                                                r.call(i.client, o, a, s, l)
                                        }
                                        ))
                                    }
                                }
                            }
                            ))
                        } else
                            r.call(i.client, !1, -1, "StringeeClient is not connected to Stringee server.", null)
                    }
                }, {
                    key: "getMessagesAfter",
                    value: function (e, t, n, r, i) {
                        var o = this;
                        if (!e || t < 0 || n < 0)
                            i.call(o.client, !1, -2, "Params are invalid.", null);
                        else if (o.client.hasConnected) {
                            var a = null != n ? n : 50
                                , s = {
                                    seqGreater: null != t ? t : 0,
                                    seqSmaller: Number.MAX_SAFE_INTEGER,
                                    limit: a,
                                    sort: "ASC",
                                    convId: e
                                };
                            o.client._sendMessage(c.CHAT_MESSAGES_LOAD, s, (function (t) {
                                if (i) {
                                    var n = 0 == t.r
                                        , a = t.r
                                        , s = n ? "Success" : null != t.message && t.message.length > 0 ? t.message : "Generic error."
                                        , l = t.msgs;
                                    if (null != l) {
                                        var d = {
                                            convIds: e
                                        };
                                        o.client._sendMessage(c.CHAT_GET_CONVERSATIONS_INFO, d, (function (e) {
                                            var t = e.listConvs
                                                , c = 0
                                                , d = 0;
                                            if (null != t && t.length > 0) {
                                                var u = t[0];
                                                c = u.lastMsgSeqReceived,
                                                    d = u.lastMsgSeqSeen
                                            }
                                            l = r ? l.map((function (e) {
                                                var t = new Ye(e, 0, c, d);
                                                return o.trackMsg(t),
                                                    t
                                            }
                                            )) : l.reverse().map((function (e) {
                                                var t = new Ye(e, 0, c, d);
                                                return o.trackMsg(t),
                                                    t
                                            }
                                            )),
                                                i.call(o.client, n, a, s, l)
                                        }
                                        ))
                                    }
                                }
                            }
                            ))
                        } else
                            i.call(o.client, !1, -1, "StringeeClient is not connected to Stringee server.", null)
                    }
                }, {
                    key: "getMessagesBefore",
                    value: function (e, t, n, r, i) {
                        var o = this;
                        if (!e || t < 0 || n < 0)
                            i.call(o.client, !1, -2, "Params are invalid.", null);
                        else if (o.client.hasConnected) {
                            var a = {
                                seqGreater: 0,
                                seqSmaller: t,
                                limit: null != n ? n : 50,
                                sort: "DESC",
                                convId: e
                            };
                            o.client._sendMessage(c.CHAT_MESSAGES_LOAD, a, (function (t) {
                                if (i) {
                                    var n = 0 == t.r
                                        , a = t.r
                                        , s = n ? "Success" : null != t.message && t.message.length > 0 ? t.message : "Generic error."
                                        , l = t.msgs;
                                    if (null != l) {
                                        var d = {
                                            convIds: e
                                        };
                                        o.client._sendMessage(c.CHAT_GET_CONVERSATIONS_INFO, d, (function (e) {
                                            var t = e.listConvs
                                                , c = 0
                                                , d = 0;
                                            if (null != t && t.length > 0) {
                                                var u = t[0];
                                                c = u.lastMsgSeqReceived,
                                                    d = u.lastMsgSeqSeen
                                            }
                                            l = r ? l.reverse().map((function (e) {
                                                var t = new Ye(e, 0, c, d);
                                                return o.trackMsg(t),
                                                    t
                                            }
                                            )) : l.map((function (e) {
                                                var t = new Ye(e, 0, c, d);
                                                return o.trackMsg(t),
                                                    t
                                            }
                                            )),
                                                i.call(o.client, n, a, s, l)
                                        }
                                        ))
                                    }
                                }
                            }
                            ))
                        } else
                            i.call(o.client, !1, -1, "StringeeClient is not connected to Stringee server.", null)
                    }
                }, {
                    key: "deleteMessage",
                    value: function (e, t, n) {
                        var r = this;
                        if (e)
                            if (t)
                                if (r.client.hasConnected) {
                                    var i = {
                                        msgIds: t,
                                        convId: e
                                    };
                                    r.client._sendMessage(c.CHAT_GET_MESSAGES_INFO, i, (function (i) {
                                        if (0 === i.r) {
                                            var o = i.listMsgs;
                                            if (null != o && o.length > 0) {
                                                var a = o[0]
                                                    , s = new Ye(a, 0)
                                                    , l = {
                                                        convId: e,
                                                        messageIds: [t]
                                                    };
                                                r.client._sendMessage(c.CHAT_DELETE_MESSAGE, l, (function (e) {
                                                    if (n) {
                                                        var t = e.r
                                                            , i = 0 == t
                                                            , o = t
                                                            , a = i ? "Success" : null != e.message && e.message.length > 0 ? e.message : "Generic error.";
                                                        n.call(r.client, i, o, a),
                                                            r.fireObjectChangeEvent(Ue, [s], qe)
                                                    }
                                                }
                                                ))
                                            }
                                        } else
                                            n.call(r.client, !1, -3, "Message is not found.")
                                    }
                                    ))
                                } else
                                    n.call(r.client, !1, -1, "StringeeClient is not connected to Stringee server.");
                            else
                                n.call(r.client, !1, -2, "Params are invalid.");
                        else
                            n.call(r.client, !1, -2, "Params are invalid.")
                    }
                }, {
                    key: "clearHistory",
                    value: function (e, t) {
                        var n = this;
                        if (e.convId)
                            if (n.client.hasConnected) {
                                var r = {
                                    seq: e.sequence,
                                    convId: e.convId
                                };
                                n.client._sendMessage(c.CHAT_CONVERSATION_CLEAR_HISTORY, r, (function (e) {
                                    if (t) {
                                        var r = e.r
                                            , i = 0 === r
                                            , o = i ? "Success" : "Fail";
                                        t.call(n.client, i, r, o)
                                    }
                                }
                                ))
                            } else
                                t.call(n.client, !1, -1, "StringeeClient is not connected to Stringee server.");
                        else
                            t.call(n.client, !1, -2, "Params are invalid.")
                    }
                }, {
                    key: "markMessageSeen",
                    value: function (e, t) {
                        var n = this;
                        if (e.convId)
                            if (n.client.hasConnected) {
                                var r = {
                                    lastMsgSeq: e.sequence,
                                    lastMsgTimestamp: e.createdAt,
                                    status: 2,
                                    convId: e.convId
                                };
                                n.client._sendMessage(c.CHAT_MESSAGE_REPORT, r, (function (e) {
                                    if (t) {
                                        var r = 0 == e.r
                                            , i = r ? 0 : -3
                                            , o = r ? "Success" : "Generic error.";
                                        t.call(n.client, r, i, o)
                                    }
                                }
                                ))
                            } else
                                t.call(n.client, !1, -1, "StringeeClient is not connected to Stringee server.");
                        else
                            t.call(n.client, !1, -2, "Params are invalid.")
                    }
                }, {
                    key: "markConversationAsRead",
                    value: function (e, t) {
                        var n = this;
                        if (e)
                            if (n.client.hasConnected) {
                                var r = {
                                    convIds: e
                                };
                                n.client._sendMessage(c.CHAT_GET_CONVERSATIONS_INFO, r, (function (r) {
                                    var i = r.listConvs;
                                    if (null != i && i.length > 0) {
                                        var o = i[0]
                                            , a = {
                                                lastMsgSeq: o.convLastSeq,
                                                lastMsgTimestamp: o.lastTimeNewMsg,
                                                status: 2,
                                                convId: e
                                            };
                                        n.client._sendMessage(c.CHAT_MESSAGE_REPORT, a, (function (r) {
                                            if (t) {
                                                var i = 0 == r.r
                                                    , o = i ? 0 : -4
                                                    , a = i ? "Success" : "Generic error.";
                                                t.call(n.client, i, o, a)
                                            }
                                            if (0 === r.r) {
                                                var s = n.trackingMap.allValues()
                                                    , c = [];
                                                s.forEach((function (t) {
                                                    if (t.conversationId === e) {
                                                        t.state = Qe,
                                                            c.push(t);
                                                        var r = n.keyForMsg(t);
                                                        n.trackingMap.remove(r)
                                                    }
                                                }
                                                )),
                                                    c.length > 0 && n.fireObjectChangeEvent(Ue, c, Be),
                                                    n.getConversationById(e, (function (e, t, r, i) {
                                                        e && null != i && n.fireObjectChangeEvent(Ge, [i], Be)
                                                    }
                                                    ))
                                            }
                                        }
                                        ))
                                    } else
                                        t && t.call(n.client, !1, -3, "Can not get conversation's info")
                                }
                                ))
                            } else
                                t.call(n.client, !1, -1, "StringeeClient is not connected to Stringee server.");
                        else
                            t.call(n.client, !1, -2, "Conversation's Id is invalid")
                    }
                }, {
                    key: "getUnreadConversationCount",
                    value: function (e) {
                        var t = this;
                        t.client.hasConnected ? t.client._sendMessage(c.CHAT_UNREAD_CONVERSATION_COUNT, {}, (function (n) {
                            if (e) {
                                var r = 0 == n.r
                                    , i = r ? 0 : -3
                                    , o = r ? "Success" : "Generic error."
                                    , a = n.count;
                                e.call(t.client, r, i, o, a)
                            }
                        }
                        )) : e.call(t.client, !1, -1, "StringeeClient is not connected to Stringee server.", null)
                    }
                }, {
                    key: "getConversationWithUser",
                    value: function (e, t) {
                        var n = this;
                        if (e)
                            if (n.client.userId && n.client.hasConnected) {
                                var r = {
                                    participants: [e, n.client.userId]
                                };
                                n.client._sendMessage(c.CHAT_CONVERSATION_FOR_USERS, r, (function (e) {
                                    if (t) {
                                        var r, i = 0 == e.r, o = i ? 0 : -3, a = i ? "Success" : "Generic error.", s = e.conversations;
                                        if (s.length > 0) {
                                            var c = s[0];
                                            r = new $e(c, 1),
                                                t.call(n.client, i, o, a, r)
                                        } else
                                            t.call(n.client, !1, -4, "Conversation is not found.", r)
                                    }
                                }
                                ))
                            } else
                                t.call(n.client, !1, -1, "StringeeClient is not connected to Stringee server");
                        else
                            t.call(n.client, !1, -2, "UserId is invalid")
                    }
                }, {
                    key: "blockUser",
                    value: function (e, t) {
                        var n = this;
                        if (e) {
                            var r = {
                                userId: e
                            };
                            n.client._sendMessage(c.CHAT_BLOCK_USER, r, (function (e) {
                                if (t) {
                                    var r = e.r
                                        , i = 0 == r
                                        , o = i ? "Success" : "Fail";
                                    t.call(n.client, i, r, o)
                                }
                            }
                            ))
                        } else
                            t.call(n.client, !1, -1, "UserId is invalid")
                    }
                }, {
                    key: "blockInviteToGroup",
                    value: function (e, t) {
                        var n = this;
                        if (e) {
                            var r = {
                                block_group_invite: e
                            };
                            n.client._sendMessage(c.CHAT_BLOCK_USER, r, (function (e) {
                                if (t) {
                                    var r = e.r
                                        , i = 0 == r
                                        , o = i ? "Success" : "Fail";
                                    t.call(n.client, i, r, o)
                                }
                            }
                            ))
                        } else
                            t.call(n.client, !1, -1, "Conversation's Id is invalid")
                    }
                }, {
                    key: "rateChat",
                    value: function (e, t, n, r) {
                        var i = this
                            , o = {
                                convId: e,
                                rating: t,
                                comment: n
                            };
                        i.client._sendMessage(c.RATE_CHAT, o, (function (e) {
                            r && r.call(i.client, e)
                        }
                        ))
                    }
                }, {
                    key: "updateUserInfo",
                    value: function (e, t) {
                        var n = this;
                        n.client._sendMessage(c.UPDATE_USER_INFO, e, (function (e) {
                            t && t.call(n.client, e)
                        }
                        ))
                    }
                }, {
                    key: "getUsersInfo",
                    value: function (e, t) {
                        var n = this;
                        if (e && e.length)
                            if (n.client.userId && n.client.hasConnected) {
                                var r = "";
                                e.forEach((function (e) {
                                    0 == r.length ? r += e : r += ", " + e
                                }
                                ));
                                var i = {
                                    userIds: r
                                };
                                n.client._sendMessage(c.CHAT_GET_USERS_INFO, i, (function (e) {
                                    if (t) {
                                        var r = e.r
                                            , i = 0 == r
                                            , o = i ? "Success" : "Fail."
                                            , a = e.users
                                            , s = [];
                                        return a.forEach((function (e) {
                                            var t = new StringeeUser(e);
                                            t.userId = e.userId,
                                                s.push(t)
                                        }
                                        )),
                                            void t.call(n.client, i, r, o, s)
                                    }
                                }
                                ))
                            } else
                                t.call(n.client, !1, -1, "StringeeClient is not connected to Stringee server", null);
                        else
                            t.call(n.client, !1, -2, "UserIds are invalid.", null)
                    }
                }, {
                    key: "sendEmailTranscript",
                    value: function (e, t) {
                        var n = this
                            , r = {
                                convId: e.convId,
                                email: e.email,
                                domain: e.domain
                            };
                        n.client._sendMessage(c.SEND_EMAIL_TRANSCRIPT, r, (function (e) {
                            t && t.call(n.client, e)
                        }
                        ))
                    }
                }, {
                    key: "getChatServices",
                    value: function (e) {
                        var t = this;
                        t.client._sendMessage(c.GET_CHAT_SERVICES, {}, (function (n) {
                            e && e.call(t.client, n)
                        }
                        ))
                    }
                }, {
                    key: "viewChat",
                    value: function (e, t) {
                        var n = this
                            , r = {
                                convId: e
                            };
                        n.client._sendMessage(c.VIEW_CHAT, r, (function (e) {
                            t && t.call(n.client, e)
                        }
                        ))
                    }
                }, {
                    key: "joinChat",
                    value: function (e, t) {
                        var n = this
                            , r = {
                                convId: e
                            };
                        n.client._sendMessage(c.JOIN_CHAT_CUSTOMER_CARE, r, (function (e) {
                            t && t.call(n.client, e)
                        }
                        ))
                    }
                }, {
                    key: "transferChat",
                    value: function (e, t, n) {
                        var r = this
                            , i = {
                                convId: e,
                                customerId: t.customerId,
                                customerName: t.customerName,
                                toUserId: t.toUserId
                            };
                        r.client._sendMessage(c.CHAT_TRANSFER_TO_ANOTHER_AGENT, i, (function (e) {
                            n && n.call(r.client, e)
                        }
                        ))
                    }
                }, {
                    key: "confirmTransferChat",
                    value: function (e, t) {
                        var n = this
                            , r = {
                                convId: e,
                                answer: 1
                            };
                        n.client._sendMessage(c.CHAT_CONFIRM_TRANSFER_REQUEST, r, (function (e) {
                            t && t.call(n.client, e)
                        }
                        ))
                    }
                }, {
                    key: "pinMessage",
                    value: function (e, t, n, r) {
                        var i = this;
                        if (i.isString(e) && i.isString(t) && "" !== e && "" !== t && null != n)
                            if (i.client.userId && i.client.hasConnected) {
                                var o = {
                                    convId: e,
                                    msgId: t,
                                    isPin: n
                                };
                                i.client._sendMessage(c.CHAT_PIN_MESSAGE, o, (function (e) {
                                    if (r) {
                                        var t = e.r
                                            , n = 0 == t
                                            , o = e.message;
                                        r.call(i.client, n, t, o)
                                    }
                                }
                                ))
                            } else
                                r.call(i.client, !1, -1, "StringeeClient is not connected to Stringee server");
                        else
                            r.call(i.client, !1, -2, "Params are invalid")
                    }
                }, {
                    key: "editMessage",
                    value: function (e, t, n, r) {
                        var i = this;
                        if (i.isString(e) && i.isString(t) && i.isString(n) && "" !== e && "" !== t && "" !== n)
                            if (i.client.userId && i.client.hasConnected) {
                                var o = {
                                    content: n
                                }
                                    , a = {
                                        convId: e,
                                        msgId: t,
                                        newContent: JSON.stringify(o)
                                    };
                                i.client._sendMessage(c.CHAT_EDIT_MESSAGE, a, (function (e) {
                                    if (r) {
                                        var t = e.r
                                            , n = 0 == t
                                            , o = e.message;
                                        r.call(i.client, n, t, o)
                                    }
                                }
                                ))
                            } else
                                r.call(i.client, !1, -1, "StringeeClient is not connected to Stringee server");
                        else
                            r.call(i.client, !1, -2, "Params are invalid")
                    }
                }, {
                    key: "revokeMessage",
                    value: function (e, t, n) {
                        var r = this;
                        if (r.isString(e) && r.isString(t) && "" !== e && "" !== t)
                            if (r.client.userId && r.client.hasConnected) {
                                var i = {
                                    convId: e,
                                    msgIds: [t]
                                };
                                r.client._sendMessage(c.CHAT_REVOKE_MESSAGE, i, (function (e) {
                                    if (n) {
                                        var t = e.r
                                            , i = 0 == t
                                            , o = e.message;
                                        n.call(r.client, i, t, o)
                                    }
                                }
                                ))
                            } else
                                n.call(r.client, !1, -1, "StringeeClient is not connected to Stringee server");
                        else
                            n.call(r.client, !1, -2, "Params are invalid")
                    }
                }, {
                    key: "userBeginTyping",
                    value: function (e, t) {
                        var n = this
                            , r = {
                                userId: e.userId,
                                convId: e.convId
                            };
                        n.client._sendMessage(c.CHAT_USER_BEGIN_TYPING, r, (function (e) {
                            t && t.call(n.client, e)
                        }
                        ))
                    }
                }, {
                    key: "userEndTyping",
                    value: function (e, t) {
                        var n = this
                            , r = {
                                userId: e.userId,
                                convId: e.convId
                            };
                        n.client._sendMessage(c.CHAT_USER_END_TYPING, r, (function (e) {
                            t && t.call(n.client, e)
                        }
                        ))
                    }
                }, {
                    key: "getAttachmentMessages",
                    value: function (e, t, n, r, i) {
                        var o = this;
                        if (o.isString(e) && "" !== e && null != t && 0 !== t && null != r && 0 !== r)
                            if (o.client.userId && o.client.hasConnected) {
                                var a = {
                                    convId: e,
                                    msgType: t,
                                    limit: r,
                                    start: n
                                };
                                o.client._sendMessage(c.CHAT_CONVERSATION_ATTACHMENT, a, (function (e) {
                                    if (i) {
                                        var t = e.r
                                            , n = 0 == t
                                            , r = e.message
                                            , a = n ? e.msgs : null;
                                        i.call(o.client, n, t, r, a)
                                    }
                                }
                                ))
                            } else
                                i.call(o.client, !1, -1, "StringeeClient is not connected to Stringee server", null);
                        else
                            i.call(o.client, !1, -2, "Params are invalid", null)
                    }
                }, {
                    key: "on",
                    value: function (e, t) {
                        this._onMethods.put(e, t)
                    }
                }, {
                    key: "_callOnEvent",
                    value: function (e, t) {
                        var n = this._onMethods.get(e);
                        n ? t ? n.call(this, t) : n.call(this) : console.log("Please implement StringeeChat event: " + e)
                    }
                }, {
                    key: "fireObjectChangeEvent",
                    value: function (e, t, n) {
                        this._callOnEvent(this.realTimeEvent, {
                            objectType: e,
                            objectChanges: t,
                            changeType: n
                        })
                    }
                }, {
                    key: "trackMsg",
                    value: function (e) {
                        if (e.state !== Qe) {
                            var t = this.keyForMsg(e);
                            this.trackingMap.put(t, e)
                        }
                    }
                }, {
                    key: "keyForMsg",
                    value: function (e) {
                        var t = null != e.conversationId && e.conversationId.length > 0 ? e.conversationId : ""
                            , n = null != e.id && e.id.length > 0 ? e.id : ""
                            , r = null != e.localId && e.localId.length > 0 ? e.localId : "";
                        return t + "_" + (r.length > 0 ? r : n)
                    }
                }, {
                    key: "isString",
                    value: function (e) {
                        var t = Ze(e);
                        return "string" === t || "object" === t && null != e && !Array.isArray(e) && "[object String]" == getTag(e)
                    }
                }]) && rt(t.prototype, n),
                r && rt(t, r),
                e
        }();
        function ot(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        var at = function () {
            function e(t) {
                !function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                    this.client = t
            }
            var t, n, r;
            return t = e,
                (n = [{
                    key: "createConversation",
                    value: function (e, t) {
                        this.created ? console.log("Could not create conversation, conversation is created") : this.client._sendMessage(c.CHAT_CREATE_CONVERSATION, e, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "sendChatMessage",
                    value: function (e, t) {
                        var n = {
                            message: e.message,
                            type: e.type,
                            convId: e.convId
                        };
                        this.client._sendMessage(c.CHAT_MESSAGE, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "loadChatMessages",
                    value: function (e, t) {
                        var n = {
                            seqGreater: e.seqGreater,
                            limit: e.limit,
                            sort: e.sort,
                            convId: e.convId
                        };
                        this.client._sendMessage(c.CHAT_MESSAGES_LOAD, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "loadAllChatMessages",
                    value: function (e, t) {
                        var n = this
                            , r = e.createdGreater
                            , i = e.createdSmaller
                            , o = e.limit
                            , a = e.sort
                            , s = e.convIds;
                        if (Array.isArray(s)) {
                            var l = {
                                createdGreater: r,
                                createdSmaller: i,
                                sort: a,
                                limit: o,
                                convIds: s = s.join(",")
                            };
                            return new Promise((function (e, r) {
                                n.client._sendMessage(c.CHAT_LOAD_ALL_MESSAGES_FOR_CONVERSATIONS, l, (function (r) {
                                    console.log("got data from server, ", r),
                                        t && (console.log("got a valid callback"),
                                            t.call(n.client, r)),
                                        e(r)
                                }
                                ))
                            }
                            ))
                        }
                        console.log("must be an array")
                    }
                }, {
                    key: "addParticipant",
                    value: function (e, t) {
                        var n = {
                            convId: e.convId,
                            userIds: e.userIds
                        };
                        this.client._sendMessage(c.CHAT_ADD_PARTICIPANT, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "removeParticipant",
                    value: function (e, t) {
                        var n = {
                            convId: e.convId,
                            userIds: e.userIds
                        };
                        this.client._sendMessage(c.CHAT_REMOVE_PARTICIPANT, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "deleteMessage",
                    value: function (e, t) {
                        var n = {
                            convId: e.convId,
                            messageIds: e.messageIds
                        };
                        this.client._sendMessage(c.CHAT_DELETE_MESSAGE, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "updateConversation",
                    value: function (e, t) {
                        var n = {
                            convId: e.convId,
                            groupName: e.name,
                            imageUrl: e.imageUrl
                        };
                        this.client._sendMessage(c.CHAT_UPDATE_CONVERSATION, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "deleteConversation",
                    value: function (e, t) {
                        var n = {
                            seq: e.seq,
                            convId: e.convId
                        };
                        this.client._sendMessage(c.CHAT_DELETE_CONVERSATION, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "clearHistory",
                    value: function (e, t) {
                        var n = {
                            seq: e.seq,
                            convId: e.convId
                        };
                        this.client._sendMessage(c.CHAT_CONVERSATION_CLEAR_HISTORY, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "loadConversations",
                    value: function (e, t) {
                        var n = {
                            lastUpdateGreater: e.lastUpdateGreater,
                            lastUpdateSmaller: e.lastUpdateSmaller,
                            limit: e.limit
                        };
                        this.client._sendMessage(c.CHAT_CONVERSATION_LOAD, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "getInfo",
                    value: function (e, t) {
                        var n = {
                            convIds: e
                        };
                        this.client._sendMessage(c.CHAT_GET_CONVERSATIONS_INFO, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "markMessageReceived",
                    value: function (e, t) {
                        var n = {
                            lastMsgSeq: e.seq,
                            lastMsgTimestamp: e.createdTime,
                            status: 1,
                            convId: e.convId
                        };
                        this.client._sendMessage(c.CHAT_MESSAGE_REPORT, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "markMessageSeen",
                    value: function (e, t) {
                        var n = {
                            lastMsgSeq: e.seq,
                            lastMsgTimestamp: e.createdTime,
                            status: 2,
                            convId: e.convId
                        };
                        this.client._sendMessage(c.CHAT_MESSAGE_REPORT, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "blockUser",
                    value: function (e, t) {
                        var n = {
                            userId: e
                        };
                        this.client._sendMessage(c.CHAT_BLOCK_USER, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "blockInviteToGroup",
                    value: function (e, t) {
                        var n = {
                            block_group_invite: e
                        };
                        this.client._sendMessage(c.CHAT_BLOCK_USER, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "rateChat",
                    value: function (e, t, n, r) {
                        var i = {
                            convId: e,
                            rating: t,
                            comment: n
                        };
                        this.client._sendMessage(c.RATE_CHAT, i, (function (e) {
                            r && r.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "updateUserInfo",
                    value: function (e, t, n, r) {
                        var i = {
                            display_name: e,
                            avatar_url: t,
                            email: n
                        };
                        this.client._sendMessage(c.UPDATE_USER_INFO, i, (function (e) {
                            r && r.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "userBeginTyping",
                    value: function (e, t) {
                        var n = {
                            userId: e.userId,
                            convId: e.convId
                        };
                        this.client._sendMessage(c.CHAT_USER_BEGIN_TYPING, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "userEndTyping",
                    value: function (e, t) {
                        var n = {
                            userId: e.userId,
                            convId: e.convId
                        };
                        this.client._sendMessage(c.CHAT_USER_END_TYPING, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "updateUserInfo",
                    value: function (e, t) {
                        this.client._sendMessage(c.UPDATE_USER_INFO, e, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "getUsersInfo",
                    value: function (e, t) {
                        var n = {
                            userIds: e
                        };
                        this.client._sendMessage(c.CHAT_GET_USERS_INFO, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "sendEmailTranscript",
                    value: function (e, t) {
                        var n = {
                            convId: e.convId,
                            email: e.email,
                            domain: e.domain
                        };
                        this.client._sendMessage(c.SEND_EMAIL_TRANSCRIPT, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "getChatServices",
                    value: function (e) {
                        this.client._sendMessage(c.GET_CHAT_SERVICES, {}, (function (t) {
                            e && e.call(this.client, t)
                        }
                        ))
                    }
                }, {
                    key: "viewChat",
                    value: function (e, t) {
                        var n = {
                            convId: e
                        };
                        this.client._sendMessage(c.VIEW_CHAT, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "joinChat",
                    value: function (e, t) {
                        var n = {
                            convId: e
                        };
                        this.client._sendMessage(c.JOIN_CHAT_CUSTOMER_CARE, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "transferChat",
                    value: function (e, t) {
                        var n = {
                            convId: e.conversationId,
                            customerId: e.customerId,
                            customerName: e.customerName,
                            toUserId: e.toUserId
                        };
                        this.client._sendMessage(c.CHAT_TRANSFER_TO_ANOTHER_AGENT, n, (function (e) {
                            t && t.call(this.client, e)
                        }
                        ))
                    }
                }, {
                    key: "confirmTransferChat",
                    value: function (e, t) {
                        var n = {
                            convId: e.convId,
                            answer: e.answer
                        };
                        console.log("+++ confirmTransferChat", n),
                            this.client._sendMessage(c.CHAT_CONFIRM_TRANSFER_REQUEST, n, (function (e) {
                                t && t.call(this.client, e)
                            }
                            ))
                    }
                }, {
                    key: "unreadConversationCount",
                    value: function (e) {
                        this.client._sendMessage(c.CHAT_UNREAD_CONVERSATION_COUNT, {}, (function (t) {
                            e && e.call(this.client, t)
                        }
                        ))
                    }
                }, {
                    key: "resolveConversation",
                    value: function (e, t) {
                        var n = {
                            convId: e.convId,
                            resolved: e.resolved
                        };
                        console.log("+++ resolveConversation", n),
                            this.client._sendMessage(c.CHAT_AGENT_RESOLVE_CONVERSATION, n, (function (e) {
                                t && t.call(this.client, e)
                            }
                            ))
                    }
                }]) && ot(t.prototype, n),
                r && ot(t, r),
                e
        }();
        function st(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        var ct = function () {
            function e() {
                !function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            var t, n, r;
            return t = e,
                r = [{
                    key: "isWebRTCSupported",
                    value: function () {
                        return !(!navigator || "undefined" == typeof navigator || !navigator.mediaDevices || void 0 === navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || void 0 === navigator.mediaDevices.getUserMedia)
                    }
                }, {
                    key: "getActiveClientId",
                    value: function () {
                        return localStorage.getItem("active_client_id")
                    }
                }],
                (n = null) && st(t.prototype, n),
                r && st(t, r),
                e
        }();
        function lt(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        var dt = function () {
            function e(t) {
                !function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                    this.stringeeClient = t,
                    this.roomId = null,
                    this.tracks = new l,
                    this.mapServerIdTracks = new l,
                    this.onMethods = new l
            }
            var t, n, r;
            return t = e,
                (n = [{
                    key: "publish",
                    value: function (e) {
                        var t = this;
                        return new Promise((function (n, r) {
                            if (e.isLocal) {
                                var i = {
                                    roomId: t.roomId,
                                    localPcId: e.webrtc.localId,
                                    audio: !!e.constraints.audio,
                                    video: !!e.constraints.video,
                                    screen: !!e.constraints.screen
                                };
                                t.stringeeClient._sendMessage(c.VIDEO_PUBLISH_TRACK, i, (function (i) {
                                    0 == i.r ? (e.serverId = i.serverTrackId,
                                        e.webrtc.serverId = i.serverPcId,
                                        t.tracks.put(e.localId, e),
                                        t.mapServerIdTracks.put(e.serverId, e),
                                        e.roomConnected = t,
                                        n(),
                                        e.processSendSdpCandidate()) : r(i)
                                }
                                ))
                            } else
                                r("Could not publish remote track")
                        }
                        ))
                    }
                }, {
                    key: "unpublish",
                    value: function (e) {
                        if (e.isLocal) {
                            var t = {
                                roomId: e.roomConnected.roomId,
                                serverTrackId: e.serverId
                            };
                            this.stringeeClient._sendMessage(c.VIDEO_UNPUBLISH_TRACK, t, (function (e) {
                                0 == e.r && console.info("VIDEO_UNPUBLISH_TRACK", e)
                            }
                            ))
                        } else
                            console.info("Could not unpublish remote track")
                    }
                }, {
                    key: "subscribe",
                    value: function (e, t) {
                        var n = this;
                        return t || (t = {
                            audio: !0,
                            video: !0,
                            screen: !1
                        }),
                            new Promise((function (r, i) {
                                var o = n.mapServerIdTracks.get(e);
                                if (o)
                                    r(o);
                                else {
                                    var a = Ie.genLocalPeerConnectionId()
                                        , s = {
                                            roomId: n.roomId,
                                            localPcId: a,
                                            subscribeTrackId: e
                                        };
                                    n.stringeeClient._sendMessage(c.VIDEO_SUBSCRIBE_TRACK, s, (function (o) {
                                        if (0 == o.r) {
                                            o.trackAudioEnable || (t.audio = !1),
                                                o.trackVideoEnable || (t.video = !1),
                                                o.trackScreenSharing && (t.audio = !1,
                                                    t.video = !0);
                                            var s = new Ee(n.stringeeClient, t);
                                            s.serverId = e,
                                                s.isLocal = !1,
                                                s.roomConnected = n,
                                                s.localId = a,
                                                s.webrtc.localId = a,
                                                s.webrtc.serverId = o.serverPcId,
                                                s.audio = o.trackAudioEnable && t.audio,
                                                s.video = o.trackVideoEnable && t.video,
                                                s.screen = o.trackScreenSharing && t.video,
                                                n.tracks.put(s.localId, s),
                                                n.mapServerIdTracks.put(s.serverId, s),
                                                r(s),
                                                s.init(),
                                                s.processSendSdpCandidate()
                                        } else
                                            i(o)
                                    }
                                    ))
                                }
                            }
                            ))
                    }
                }, {
                    key: "unsubscribe",
                    value: function (e) {
                        var t = this
                            , n = {
                                roomId: t.roomId,
                                serverTrackId: e.serverId,
                                serverPcId: e.webrtc.serverId
                            };
                        t.stringeeClient._sendMessage(c.VIDEO_UNSUBSCRIBE_TRACK, n, (function (n) {
                            0 == n.r && (console.log("unsubscribe serverTrackId OK: " + e.serverId),
                                e.close(),
                                t.tracks.remove(e.localId),
                                t.mapServerIdTracks.remove(e.serverId))
                        }
                        ))
                    }
                }, {
                    key: "leave",
                    value: function (e) {
                        var t = this;
                        return t.tracks.forEach((function (e) {
                            e.value.close(),
                                t.tracks.remove(e.localId),
                                t.mapServerIdTracks.remove(e.serverId)
                        }
                        )),
                            new Promise((function (n, r) {
                                var i = {
                                    roomId: t.roomId,
                                    allStringeeClient: e
                                };
                                t.stringeeClient._sendMessage(c.VIDEO_LEFT_ROOM, i, (function (e) {
                                    Ie.rooms.remove(t.roomId),
                                        0 == e.r ? n() : r(e)
                                }
                                ))
                            }
                            ))
                    }
                }, {
                    key: "sendMessage",
                    value: function (e) {
                        var t = this;
                        return new Promise((function (n, r) {
                            var i = {
                                roomId: t.roomId,
                                msg: e
                            };
                            t.stringeeClient._sendMessage(c.VIDEO_ROOM_SEND_MSG, i, (function (e) {
                                0 == e.r ? n() : r(e)
                            }
                            ))
                        }
                        ))
                    }
                }, {
                    key: "onReceiveSdp1",
                    value: function (e, t, n) {
                        var r = this.tracks.get(e);
                        r ? r.onSdpFromServer(n) : console.log("StringeeVideoRoom onReceiveSdp1: Could not found localTrackId=" + e)
                    }
                }, {
                    key: "onReceiveCandidate1",
                    value: function (e, t, n) {
                        var r = this.tracks.get(e);
                        r ? r.onCandidateFromServer(n) : console.log("StringeeVideoRoom onReceiveCandidate1: Could not found localTrackId=" + e)
                    }
                }, {
                    key: "clearAllOnMethos",
                    value: function () {
                        this.onMethods.clear()
                    }
                }, {
                    key: "on",
                    value: function (e, t) {
                        var n = this.onMethods.get(e);
                        n || (n = new Array,
                            this.onMethods.put(e, n)),
                            n.push(t)
                    }
                }, {
                    key: "callOnEvent",
                    value: function (e, t) {
                        var n = this
                            , r = this.onMethods.get(e);
                        r ? r.forEach((function (e) {
                            t ? e.call(n, t) : e.call(n)
                        }
                        )) : console.log("Please implement StringeeVideoRoom event: " + e)
                    }
                }, {
                    key: "onTrackAdded",
                    value: function (e) {
                        var t = {
                            info: e
                        };
                        this.callOnEvent("addtrack", t)
                    }
                }, {
                    key: "onTrackRemoved",
                    value: function (e) {
                        var t = this.mapServerIdTracks.get(e.track.serverId)
                            , n = {
                                info: e
                            };
                        t && (n.track = t,
                            t.close()),
                            this.callOnEvent("removetrack", n)
                    }
                }, {
                    key: "onRoomJoined",
                    value: function (e) {
                        var t = {
                            info: e
                        };
                        this.callOnEvent("joinroom", t)
                    }
                }, {
                    key: "onRoomLeft",
                    value: function (e) {
                        var t = {
                            info: e
                        };
                        this.callOnEvent("leaveroom", t)
                    }
                }, {
                    key: "onRoomMsg",
                    value: function (e) {
                        var t = {
                            info: e
                        };
                        this.callOnEvent("message", t)
                    }
                }]) && lt(t.prototype, n),
                r && lt(t, r),
                e
        }();
        window.StringeeCall = Ce,
            window.StringeeCall2 = Oe,
            window.StringeeChat = it,
            window.StringeeHashMap = l,
            window.DeprecatedStringeeChat = at,
            window.StringeeClient = xe,
            window.StringeeUtil = ct,
            window.StringeeServiceType = c,
            window.StringeeWebRtc = _e,
            window.StringeeVideo = Ie,
            window.StringeeVideoRoom = dt,
            window.StringeeVideoTrack = Ee
    }
]);



// room_Data.room.sendMessage({
//     type: "mic-status",
//     userId: "Nguyen Quang Tung - Chu tich",
//     isMicMuted: true
// }).then(() => {
//     console.log("Thông báo đã được gửi thành công!");
// }).catch((error) => {
//     console.error("Lỗi khi gửi thông báo:", error);
// });