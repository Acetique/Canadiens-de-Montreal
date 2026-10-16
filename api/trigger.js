// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0

// @version=5



indicator(shorttitle = "Vector + OTT (Acetique)", title = " Vector & OTT Cloud [Acetique]", overlay = true, max_bars_back = 3000)

import TradersReality/Traders_Reality_Lib/2 as trLib



source_00 = hlcc4 //input.source(hlcc4, "General Source", group = "================")



//=======================================================================================================================//

//=======================================================================================================================//

// SSL



show_mas1 = input.bool(true, title = "Show MA1", group = "============= Moving Average =============")

show_mas2 = input.bool(true, title = "Show MA2", group = "============= Moving Average =============")

show_mas3 = input.bool(true, title = "Show MA3", group = "============= Moving Average =============")

show_mas4 = input.bool(true, title = "Show MA4", group = "============= Moving Average =============")

show_mas5 = input.bool(false, title = "Show MA5", group = "============= Moving Average =============")



length01 = input.int(08, title = "Length1", minval = 1, group = "============= Moving Average =============")

length02 = input.int(21, title = "Length2", minval = 1, group = "============= Moving Average =============")

length03 = input.int(50, title = "Length3", minval = 1, group = "============= Moving Average =============")

length04 = input.int(100, title = "Length4", minval = 1, group = "============= Moving Average =============")

length05 = input.int(200, title = "Length5", minval = 1, group = "============= Moving Average =============")



//=======================================================================================================================//

// Channel



show_ch1 = input(true, title = "Show Channel 1", group = "============= Optimized Trend Tracker =============")

show_ch2 = input(true, title = "Show Channel 2", group = "============= Optimized Trend Tracker =============")

show_ch3 = input(false, title = "Show Channel 3", group = "============= Optimized Trend Tracker =============")

show_ch1F = input(true, title = "Show Channel Fill 1", group = "============= Optimized Trend Tracker =============")

show_ch2F = input(true, title = "Show Channel Fill 2", group = "============= Optimized Trend Tracker =============")

show_fib = input(false, title = "Show Fibonaci Parallels", group = "============= Optimized Trend Tracker =============")



//=======================================================================================================================//



ma_os = input.int(1, "Channel Offset",   minval = 0, maxval = 500, group = "============= Optimized Trend Tracker =============")



//=======================================================================================================================//

// Heikin Ashi



show_ha00 = false//input(false, title = "Show Heikin Ashi Body", group = "============= Heikin Ashi =============")

HA00 = 0//input.int(3, title = "Heikin Ashi Calc Period", minval = 1, group = "============= Heikin Ashi =============")

HA03 = 0//input.int(3, title = "Heikin Ashi Body Period", minval = 1, group = "============= Heikin Ashi =============")

ha1_transp = 0//input.int(30, 'HA Transparency', minval = 0, maxval = 100, step = 1, group = "============= Heikin Ashi =============")



//



hkClose         = source_00

hkOpen          = float(na)

hkOpen          := na(hkOpen[HA00]) ? (open + hkClose) / 2 : (nz(hkOpen[HA00]) + nz(hkClose[HA00])) / 2



//



hkOpen03          = float(na)

hkOpen03          := na(hkOpen03[HA03]) ? (open + hkClose) / 2 : (nz(hkOpen03[HA03]) + nz(hkClose[HA03])) / 2



//=======================================================================================================================//



HAsrc_H = hkClose > hkOpen ? high : hkClose < hkOpen ? hkOpen : high

HAsrc_L = hkClose < hkOpen ? low : hkClose > hkOpen ? hkOpen : low



//=======================================================================================================================//



//HLVar_Func(source, length) =>

//    valpha = 2 / (length + 1)

//    vud1 = source > source[1] ? source - source[1] : 0

//    vdd1 = source < source[1] ? source[1] - source : 0

//    vUD = math.sum(vud1, 9)

//    vDD = math.sum(vdd1, 9)

//    vCMO = nz((vUD - vDD) / (vUD + vDD))

//    HLVAR = 0.0

//    HLVAR := nz(valpha * math.abs(vCMO) * source) + (1 - valpha * math.abs(vCMO)) * nz(HLVAR[1])

//    HLVAR



//=======================================================================================================================//



//lsmao = input.int(title = "LSMA Offset", defval = 0 , group = "============= Moving Average LSMA =============")



//=======================================================================================================================//



//kama_Func(source, length) =>



//    KAMA = 0.0

//    xvnoise = math.abs(source - source[1])

//    nfastend = 0.666

//    nslowend = 0.0645

//    nsignal = math.abs(source - source[length])

//    nnoise = math.sum(xvnoise, length)

//    nefratio = nnoise != 0 ? nsignal / nnoise : 0

//    nsmooth = math.pow(nefratio * (nfastend - nslowend) + nslowend, 2)

//    KAMA := nz(KAMA[1]) + nsmooth * (source - nz(KAMA[1]))

//    KAMA



//=======================================================================================================================//



//trama_Func(source, length) =>



//    ama = 0.

//    hhA = math.max(math.sign(ta.change(ta.highest(length))), 0)

//    llA = math.max(math.sign(ta.change(ta.lowest(length)) * -1), 0)

//    tc = math.pow(ta.sma(bool(hhA) or bool(llA) ? 1 : 0, length), 2)

//    ama := nz(ama[1] + tc * (source - ama[1]), source)

//    ama



//=======================================================================================================================//



//DEMA_Func(source, length) =>

//    HLDEMA = 0.0

//    HLDEMA := 2 * ta.ema(source, length) - ta.ema(ta.ema(source, length), length)

//    HLDEMA



//=======================================================================================================================//



//HLZlema_Func(source, length) =>

//    zxLag = length / 2 == math.round(length / 2) ? length / 2 : (length - 1) / 2

//    zxEMAData = source + source - source[zxLag]

//    HLZLEMA = ta.ema(zxEMAData, length)

//    HLZLEMA



//=======================================================================================================================//

//Time Series Forecast (TSF)



//HLTsf_Func(source, length) =>

//    lrc = ta.linreg(source, length, 0)

//    lrc1 = ta.linreg(source, length, 1)

//    lrs = lrc - lrc1

//    HLTSF = ta.linreg(source, length, 0) + lrs

//    HLTSF

//=======================================================================================================================//



//HLWwma_Func(source, length) =>

//    wwalpha = 1 / length

//    HLWWMA = 0.0

//    HLWWMA := wwalpha * source + (1 - wwalpha) * nz(HLWWMA[1])

//    HLWWMA



//=======================================================================================================================//



ma1(source, length, type) =>

    switch type

        "SMA" => ta.sma(source, length)

        "EMA" => ta.ema(source, length)

        "SMMA (RMA)" => ta.rma(source, length)

        "WMA" => ta.wma(source, length)

        "VWMA" => ta.vwma(source, length)

        "HMA" => ta.hma(source, length)

//        "KAMA" => kama_Func(source, length)

//        "LSMA" => ta.linreg(source, length, offset = lsmao)

//        "TRAMA" => trama_Func(source, length)

//        "VAR" => HLVar_Func(source, length)

//        "DEMA" => DEMA_Func(source, length)

//        "ZLEMA" => HLZlema_Func(source, length)

//        "TSF" => HLTsf_Func(source, length)

//        "WWMA" => HLWwma_Func(source, length)



//=======================================================================================================================//



mode_ma1 = input.string(defval = "EMA", options = ["SMA", "EMA", "SMMA (RMA)", "WMA", "VWMA", "HMA"],

     title = 'MA Type', group = "============= Moving Average =============")

mode_ma2 = input.string(defval = "EMA", options = ["SMA", "EMA", "SMMA (RMA)", "WMA", "VWMA", "HMA"],

     title = 'Blend Type', group = "============= Moving Average =============")

mode_ma3 = input.string(defval = "EMA", options = ["SMA", "EMA", "SMMA (RMA)", "WMA", "VWMA", "HMA"],

     title = 'OTT Channel Type', group = "============= Moving Average =============")



//=======================================================================================================================//

// Simple



bs01_H = ma1(HAsrc_H, length01, mode_ma1) //src

bs01_L = ma1(HAsrc_L, length01, mode_ma1)



bs02_H = ma1(HAsrc_H, length02, mode_ma1)

bs02_L = ma1(HAsrc_L, length02, mode_ma1)



bs03_H = ma1(HAsrc_H, length03, mode_ma1)

bs03_L = ma1(HAsrc_L, length03, mode_ma1)



bs04_H = ma1(HAsrc_H, length04, mode_ma1)

bs04_L = ma1(HAsrc_L, length04, mode_ma1)



bs05_H = ma1(HAsrc_H, length05, mode_ma1)

bs05_L = ma1(HAsrc_L, length05, mode_ma1)



// Smooth



Sbs01_H = ma1(bs01_H, length01, mode_ma2)

Sbs01_L = ma1(bs01_L, length01, mode_ma2)



Sbs02_H = ma1(bs02_H, length02, mode_ma2)

Sbs02_L = ma1(bs02_L, length02, mode_ma2)



Sbs03_H = ma1(bs03_H, length03, mode_ma2)

Sbs03_L = ma1(bs03_L, length03, mode_ma2)



Sbs04_H = ma1(bs04_H, length04, mode_ma2)

Sbs04_L = ma1(bs04_L, length04, mode_ma2)



Sbs05_H = ma1(bs05_H, length05, mode_ma2)

Sbs05_L = ma1(bs05_L, length05, mode_ma2)



// Double



Dbs01_H = 2 * bs01_H - Sbs01_H

Dbs01_L = 2 * bs01_L - Sbs01_L



Dbs02_H = 2 * bs02_H - Sbs02_H

Dbs02_L = 2 * bs02_L - Sbs02_L



Dbs03_H = 2 * bs03_H - Sbs03_H

Dbs03_L = 2 * bs03_L - Sbs03_L



Dbs04_H = 2 * bs04_H - Sbs04_H

Dbs04_L = 2 * bs04_L - Sbs04_L



Dbs05_H = 2 * bs05_H - Sbs05_H

Dbs05_L = 2 * bs05_L - Sbs05_L



//=======================================================================================================================//



tp_AH(type) =>

    switch type

        "Simple" => bs01_H

        "Smoothed" => Sbs01_H

        "Double" => Dbs01_H



tp_BH(type) =>

    switch type

        "Simple" => bs02_H

        "Smoothed" => Sbs02_H

        "Double" => Dbs02_H



tp_CH(type) =>

    switch type

        "Simple" => bs03_H

        "Smoothed" => Sbs03_H

        "Double" => Dbs03_H



tp_DH(type) =>

    switch type

        "Simple" => bs04_H

        "Smoothed" => Sbs04_H

        "Double" => Dbs04_H



tp_EH(type) =>

    switch type

        "Simple" => bs05_H

        "Smoothed" => Sbs05_H

        "Double" => Dbs05_H



//



tp_AL(type) =>

    switch type

        "Simple" => bs01_L

        "Smoothed" => Sbs01_L

        "Double" => Dbs01_L



tp_BL(type) =>

    switch type

        "Simple" => bs02_L

        "Smoothed" => Sbs02_L

        "Double" => Dbs02_L



tp_CL(type) =>

    switch type

        "Simple" => bs03_L

        "Smoothed" => Sbs03_L

        "Double" => Dbs03_L



tp_DL(type) =>

    switch type

        "Simple" => bs04_L

        "Smoothed" => Sbs04_L

        "Double" => Dbs04_L



tp_EL(type) =>

    switch type

        "Simple" => bs05_L

        "Smoothed" => Sbs05_L

        "Double" => Dbs05_L



//=======================================================================================================================//



mode_tp0 = input.string(defval = "Smoothed", options = ["Simple", "Smoothed", "Double"], title = 'Mode', group = "============= Moving Average =============")



//=======================================================================================================================//

// SSL 1



Hlv01 = int(na)

Hlv01 := hkClose > tp_AH(mode_tp0) ? 1 : hkClose < tp_AL(mode_tp0) ? -1 : Hlv01[1]

sslDn01 = Hlv01 < 0 ? tp_AH(mode_tp0) : tp_AL(mode_tp0)

sslUp01 = Hlv01 < 0 ? tp_AL(mode_tp0) : tp_AH(mode_tp0)



// SSL 2



Hlv02 = int(na)

Hlv02 := hkClose > tp_BH(mode_tp0) ? 1 : hkClose < tp_BL(mode_tp0) ? -1 : Hlv02[1]

sslDn02 = Hlv02 < 0 ? tp_BH(mode_tp0) : tp_BL(mode_tp0)

sslUp02 = Hlv02 < 0 ? tp_BL(mode_tp0) : tp_BH(mode_tp0)



// SSL 3



Hlv03 = int(na)

Hlv03 := hkClose > tp_CH(mode_tp0) ? 1 : hkClose < tp_CL(mode_tp0) ? -1 : Hlv03[1]

sslDn03 = Hlv03 < 0 ? tp_CH(mode_tp0) : tp_CL(mode_tp0)

sslUp03 = Hlv03 < 0 ? tp_CL(mode_tp0) : tp_CH(mode_tp0)



// SSL 4



Hlv04 = int(na)

Hlv04 := hkClose > tp_DH(mode_tp0) ? 1 : hkClose < tp_DL(mode_tp0) ? -1 : Hlv04[1]

sslDn04 = Hlv04 < 0 ? tp_DH(mode_tp0) : tp_DL(mode_tp0)

sslUp04 = Hlv04 < 0 ? tp_DL(mode_tp0) : tp_DH(mode_tp0)



// SSL 5



Hlv05 = int(na)

Hlv05 := hkClose > tp_EH(mode_tp0) ? 1 : hkClose < tp_EL(mode_tp0) ? -1 : Hlv05[1]

sslDn05 = Hlv05 < 0 ? tp_EH(mode_tp0) : tp_EL(mode_tp0)

sslUp05 = Hlv05 < 0 ? tp_EL(mode_tp0) : tp_EH(mode_tp0)



//=======================================================================================================================//

// Calculate HTF RSI



// Make an input that selects which other time frame a 

// part of the script's code runs on

// BackgroundData() loads data with the request.security() function in

// the background, without repainting.



BackgroundData(symbol, timeframe, data) =>

    isLive = barstate.isrealtime

    request.security(symbol, timeframe, data[isLive ? 1 : 0])[isLive ? 0 : 1]



// Create inputs



higherTimeFrame04 = input.timeframe("", title = "Higher Time Frame Sslch M14", group = "============= HTF Sslch MAs =============")

higherTimeFrame05 = input.timeframe("", title = "Higher Time Frame Sslch M15", group = "============= HTF Sslch MAs =============")



// Calculate HTF



htf04H = BackgroundData(syminfo.tickerid, higherTimeFrame04, sslUp04)

htf04L = BackgroundData(syminfo.tickerid, higherTimeFrame04, sslDn04)



htf05H = BackgroundData(syminfo.tickerid, higherTimeFrame05, sslUp05)

htf05L = BackgroundData(syminfo.tickerid, higherTimeFrame05, sslDn05)



//



ssl01 = math.avg(sslUp01, sslDn01)

ssl02 = math.avg(sslUp02, sslDn02)

ssl03 = math.avg(sslUp03, sslDn03)



//



ssl04 = math.avg(htf04L, htf04H)

ssl05 = math.avg(htf05L, htf05H)



//=======================================================================================================================//

// Color



bull_col01 = input.color(color.new(#008000, 00), title = "", inline = "1", group = "============= Moving Average =============")

bear_col01 = input.color(color.new(#800000, 00), title = "", inline = "1", group = "============= Moving Average =============")



//



//bull_col = input.color(#00ff00, title = "", inline = "1", group = "============= Heikin Ashi =============")

//bear_col = input.color(#ff0000, title = "", inline = "1", group = "============= Heikin Ashi =============")

//bull = input.color(#008141, title = "", inline = "1", group = "============= Heikin Ashi =============")

//bear = input.color(#814100, title = "", inline = "1", group = "============= Heikin Ashi =============")

//extr = input.color(#410081, title = "", inline = "1", group = "============= Heikin Ashi =============")



//



//bull_col_ = input.color(#4dff4d, title = "", inline = "1", group = "======== Price, Volume, S&R Analysis ========")

//bear_col_ = input.color(#ff4d4d, title = "", inline = "1", group = "======== Price, Volume, S&R Analysis ========")

//bull_cl = input.color(#008900, title = "", inline = "1", group = "======== Price, Volume, S&R Analysis ========")

//bear_cl = input.color(#890000, title = "", inline = "1", group = "======== Price, Volume, S&R Analysis ========")

//neut_cl = input.color(color.new(#000000, 45), title = "", inline = "1", group = "======== Price, Volume, S&R Analysis ========")



//



color redVectorColor = input.color(title='Vector: Red', group='============== PVSRA Colors ==============', defval=color.red, inline='vectors')

color greenVectorColor = input.color(title='Green', group='============== PVSRA Colors ==============', defval=color.lime, inline='vectors')

color violetVectorColor = input.color(title='Violet', group='============== PVSRA Colors ==============', defval=color.fuchsia, inline='vectors')

color blueVectorColor = input.color(title='Blue', group='============== PVSRA Colors ==============', defval=color.blue, inline='vectors', tooltip='Bull bars are green and bear bars are red when the bar is with volume >= 200% of the average volume of the 10 previous bars, or bars where the product of candle spread x candle volume is >= the highest for the 10 previous bars.\n Bull bars are blue and bear are violet when the bar is with with volume >= 150% of the average volume of the 10 previous bars.')

color regularCandleUpColor = input.color(title='Regular: Up Candle', group='============== PVSRA Colors ==============', defval=#999999, inline='nonVectors')

color regularCandleDownColor = input.color(title='Down Candle', group='============== PVSRA Colors ==============', defval=#4d4d4d, inline='nonVectors', tooltip='Bull bars are light gray and bear are dark gray when none of the red/green/blue/violet vector conditions are met.')



bool overrideSym = false //input.bool(group='PVSRA Override', title='Override chart symbol?', defval=false, inline='pvsra')

string pvsraSym = "" //input.string(group='PVSRA Override', title='', defval='INDEX:BTCUSD', tooltip='You can use INDEX:BTCUSD or you can combine multiple feeds, for example BINANCE:BTCUSDT+COINBASE:BTCUSD. Note that adding too many will slow things down.', inline='pvsra')



bool showVCZ = input.bool(true, 'Show VCZ?' , group='Vector Candle Zones', inline="vczOn")

int zonesMax = input.int(25, 'Maximum zones to draw', group='Vector Candle Zones', inline="vczOn")

string zoneType = input.string(group='Vector Candle Zones', defval='Body only', title='Zone top/bottom is defined with: ', options=['Body only', 'Body with wicks'])

string zoneUpdateType = input.string(group='Vector Candle Zones', defval='Body with wicks', title='Zones are cleared using candle: ', options=['Body only', 'Body with wicks'])

int borderWidth = input.int(0, 'Zone border width', group='Vector Candle Zones')

bool colorOverride = input.bool(true, 'Override color?' , group='Vector Candle Zones', inline="vcz1")

color zoneColor = input.color(title='Color', group='Vector Candle Zones', defval=color.rgb(255, 230, 75, 90), inline="vcz1", tooltip='the vector candle zones color to use if you dont not want to use the PVSRA Candle Colors.')

int transperancy = input.int(90, 'Zone Transperancy', minval = 0, maxval = 100, group='Vector Candle Zones', tooltip='If the vector candle zones color is not overriden, then we want to set the transparancy of the vector candle colors as defined by the PBSRA candle colors. This setting only affects the candle zone colors not the candle colors themselves.')



//



bull_ch = input.color(color.new(#00ffff,00), title = "", inline = "1", group = "============= Optimized Trend Tracker =============")

bear_ch = input.color(color.new(#0000b3,00), title = "", inline = "1", group = "============= Optimized Trend Tracker =============")

bull_ch2 = input.color(color.new(#00ffff,60), title = "", inline = "1", group = "============= Optimized Trend Tracker =============")

bear_ch2 = input.color(color.new(#0000b3,80), title = "", inline = "1", group = "============= Optimized Trend Tracker =============")

neut_ch = input.color(color.new(#4d4dff,00), title = "", inline = "1", group = "============= Optimized Trend Tracker =============")

neut_ch2 = input.color(color.new(#0000ff,00), title = "", inline = "1", group = "============= Optimized Trend Tracker =============")



//=======================================================================================================================//



LB1 = input(08, title = "Look Back Period 1", group = "============= Optimized Trend Tracker =============")

LB2 = input(32, title = "Look Back Period 2", group = "============= Optimized Trend Tracker =============")

LB3 = input(128, title = "Look Back Period 3", group = "============= Optimized Trend Tracker =============")

Fib1 = input.float(0.25, title = "Parallel proportion factor 1", group = "============= Optimized Trend Tracker =============")

Fib2 = input.float(0.75, title = "Parallel proportion factor 2", group = "============= Optimized Trend Tracker =============")



HLpercent = input.float(1, title = 'OTT Optimization Coeff', step=0.1, minval=0, group = "============= Optimized Trend Tracker =============", tooltip = "Works better between 1 - 10 Range")



//=======================================================================================================================//

// Optimized Trend Tracker



OTT_Func(MA_Source) =>

    fark = MA_Source * HLpercent * 0.01

    longStop = MA_Source - fark

    longStopPrev = nz(longStop[1], longStop)

    longStop := MA_Source > longStopPrev ? math.max(longStop, longStopPrev) : longStop

    shortStop = MA_Source + fark

    shortStopPrev = nz(shortStop[1], shortStop)

    shortStop := MA_Source < shortStopPrev ? math.min(shortStop, shortStopPrev) : shortStop

    dir = 1

    dir := nz(dir[1], dir)

    dir := dir == -1 and MA_Source > shortStopPrev ? 1 : dir == 1 and MA_Source < longStopPrev ? -1 : dir

    MT = dir == 1 ? longStop : shortStop

    OTT = MA_Source > MT ? MT * (200 + HLpercent) / 200 : MT * (200 - HLpercent) / 200





//=======================================================================================================================//

// Channel H // source_00



Htp0__ = ta.highest(source_00, LB1)

Htp0_ = OTT_Func(ma1(Htp0__, LB1, mode_ma3))



Htp1__ = ta.highest(ssl01, LB1)

Htp1_ = OTT_Func(ma1(Htp1__, LB1, mode_ma3))



Htp2__ = ta.highest(ssl02, LB1)

Htp2_ = OTT_Func(ma1(Htp2__, LB1, mode_ma3))



Htp3__ = ta.highest(ssl03, LB1)

Htp3_ = OTT_Func(ma1(Htp3__, LB1, mode_ma3))



Htp4__ = ta.highest(ssl04, LB1)

Htp4_ = OTT_Func(ma1(Htp4__, LB1, mode_ma3))



Htp5__ = ta.highest(ssl05, LB1)

Htp5_ = OTT_Func(ma1(Htp5__, LB1, mode_ma3))



// Channel L



Ltp0__ = ta.lowest(source_00, LB1)

Ltp0_ = OTT_Func(ma1(Ltp0__, LB1, mode_ma3))



Ltp1__ = ta.lowest(ssl01, LB1)

Ltp1_ = OTT_Func(ma1(Ltp1__, LB1, mode_ma3))



Ltp2__ = ta.lowest(ssl02, LB1)

Ltp2_ = OTT_Func(ma1(Ltp2__, LB1, mode_ma3))



Ltp3__ = ta.lowest(ssl03, LB1)

Ltp3_ = OTT_Func(ma1(Ltp3__, LB1, mode_ma3))



Ltp4__ = ta.lowest(ssl04, LB1)

Ltp4_ = OTT_Func(ma1(Ltp4__, LB1, mode_ma3))



Ltp5__ = ta.lowest(ssl05, LB1)

Ltp5_ = OTT_Func(ma1(Ltp5__, LB1, mode_ma3))



//=======================================================================================================================//

// Channel H // source_00 // 2



Htp0__2 = ta.highest(source_00, LB2)

Htp0_2 = OTT_Func(ma1(Htp0__2, LB2, mode_ma3))



Htp1__2 = ta.highest(ssl01, LB2)

Htp1_2 = OTT_Func(ma1(Htp1__2, LB2, mode_ma3))



Htp2__2 = ta.highest(ssl02, LB2)

Htp2_2 = OTT_Func(ma1(Htp2__2, LB2, mode_ma3))



Htp3__2 = ta.highest(ssl03, LB2)

Htp3_2 = OTT_Func(ma1(Htp3__2, LB2, mode_ma3))



Htp4__2 = ta.highest(ssl04, LB2)

Htp4_2 = OTT_Func(ma1(Htp4__2, LB2, mode_ma3))



Htp5__2 = ta.highest(ssl05, LB2)

Htp5_2 = OTT_Func(ma1(Htp5__2, LB2, mode_ma3))



// Channel L 2



Ltp0__2 = ta.lowest(source_00, LB2)

Ltp0_2 = OTT_Func(ma1(Ltp0__2, LB2, mode_ma3))



Ltp1__2 = ta.lowest(ssl01, LB2)

Ltp1_2 = OTT_Func(ma1(Ltp1__2, LB2, mode_ma3))



Ltp2__2 = ta.lowest(ssl02, LB2)

Ltp2_2 = OTT_Func(ma1(Ltp2__2, LB2, mode_ma3))



Ltp3__2 = ta.lowest(ssl03, LB2)

Ltp3_2 = OTT_Func(ma1(Ltp3__2, LB2, mode_ma3))



Ltp4__2 = ta.lowest(ssl04, LB2)

Ltp4_2 = OTT_Func(ma1(Ltp4__2, LB2, mode_ma3))



Ltp5__2 = ta.lowest(ssl05, LB2)

Ltp5_2 = OTT_Func(ma1(Ltp5__2, LB2, mode_ma3))



//=======================================================================================================================//

//=======================================================================================================================//

// Channel H // source_00 // 2



Htp0__3 = ta.highest(source_00, LB3)

Htp0_3 = OTT_Func(ma1(Htp0__3, LB3, mode_ma3))



Htp1__3 = ta.highest(ssl01, LB3)

Htp1_3 = OTT_Func(ma1(Htp1__3, LB3, mode_ma3))



Htp2__3 = ta.highest(ssl02, LB3)

Htp2_3 = OTT_Func(ma1(Htp2__3, LB3, mode_ma3))



Htp3__3 = ta.highest(ssl03, LB3)

Htp3_3 = OTT_Func(ma1(Htp3__3, LB3, mode_ma3))



Htp4__3 = ta.highest(ssl04, LB3)

Htp4_3 = OTT_Func(ma1(Htp4__3, LB3, mode_ma3))



Htp5__3 = ta.highest(ssl05, LB3)

Htp5_3 = OTT_Func(ma1(Htp5__3, LB3, mode_ma3))



// Channel L 2



Ltp0__3 = ta.lowest(source_00, LB3)

Ltp0_3 = OTT_Func(ma1(Ltp0__3, LB3, mode_ma3))



Ltp1__3 = ta.lowest(ssl01, LB3)

Ltp1_3 = OTT_Func(ma1(Ltp1__3, LB3, mode_ma3))



Ltp2__3 = ta.lowest(ssl02, LB3)

Ltp2_3 = OTT_Func(ma1(Ltp2__3, LB3, mode_ma3))



Ltp3__3 = ta.lowest(ssl03, LB3)

Ltp3_3 = OTT_Func(ma1(Ltp3__3, LB3, mode_ma3))



Ltp4__3 = ta.lowest(ssl04, LB3)

Ltp4_3 = OTT_Func(ma1(Ltp4__3, LB3, mode_ma3))



Ltp5__3 = ta.lowest(ssl05, LB3)

Ltp5_3 = OTT_Func(ma1(Ltp5__3, LB3, mode_ma3))



//=======================================================================================================================//

// Calculate HTF



Htp0 = Htp0_

Htp1 = Htp1_ // BackgroundData(syminfo.tickerid, higherTimeFrame01, Htp1_)

Htp2 = Htp2_ // BackgroundData(syminfo.tickerid, higherTimeFrame02, Htp2_)

Htp3 = Htp3_ // BackgroundData(syminfo.tickerid, higherTimeFrame03, Htp3_)

Htp4 = BackgroundData(syminfo.tickerid, higherTimeFrame04, Htp4_)

Htp5 = BackgroundData(syminfo.tickerid, higherTimeFrame05, Htp5_)



Ltp0 = Ltp0_

Ltp1 = Ltp1_ // BackgroundData(syminfo.tickerid, higherTimeFrame01, Ltp1_)

Ltp2 = Ltp2_ // BackgroundData(syminfo.tickerid, higherTimeFrame02, Ltp2_)

Ltp3 = Ltp3_ // BackgroundData(syminfo.tickerid, higherTimeFrame03, Ltp3_)

Ltp4 = BackgroundData(syminfo.tickerid, higherTimeFrame04, Ltp4_)

Ltp5 = BackgroundData(syminfo.tickerid, higherTimeFrame05, Ltp5_)



// Calculate HTF // 2



Htp02 = Htp0_2

Htp12 = Htp1_2 // BackgroundData(syminfo.tickerid, higherTimeFrame01, Htp1_)

Htp22 = Htp2_2 // BackgroundData(syminfo.tickerid, higherTimeFrame02, Htp2_)

Htp32 = Htp3_2 // BackgroundData(syminfo.tickerid, higherTimeFrame03, Htp3_)

Htp42 = BackgroundData(syminfo.tickerid, higherTimeFrame04, Htp4_2)

Htp52 = BackgroundData(syminfo.tickerid, higherTimeFrame05, Htp5_2)



Ltp02 = Ltp0_2

Ltp12 = Ltp1_2 // BackgroundData(syminfo.tickerid, higherTimeFrame01, Ltp1_)

Ltp22 = Ltp2_2 // BackgroundData(syminfo.tickerid, higherTimeFrame02, Ltp2_)

Ltp32 = Ltp3_2 // BackgroundData(syminfo.tickerid, higherTimeFrame03, Ltp3_)

Ltp42 = BackgroundData(syminfo.tickerid, higherTimeFrame04, Ltp4_2)

Ltp52 = BackgroundData(syminfo.tickerid, higherTimeFrame05, Ltp5_2)



// Calculate HTF // 3



Htp03 = Htp0_3

Htp13 = Htp1_3

Htp23 = Htp2_3

Htp33 = Htp3_3

Htp43 = BackgroundData(syminfo.tickerid, higherTimeFrame04, Htp4_3)

Htp53 = BackgroundData(syminfo.tickerid, higherTimeFrame05, Htp5_3)



Ltp03 = Ltp0_3

Ltp13 = Ltp1_3

Ltp23 = Ltp2_3

Ltp33 = Ltp3_3

Ltp43 = BackgroundData(syminfo.tickerid, higherTimeFrame04, Ltp4_3)

Ltp53 = BackgroundData(syminfo.tickerid, higherTimeFrame05, Ltp5_3)



//=======================================================================================================================//

// Plot Channel 1



ch1(type) =>

    switch type

        "Ch0" => Htp0

        "Ch1" => Htp1

        "Ch2" => Htp2

        "Ch3" => Htp3

        "Ch4" => Htp4

        "Ch5" => Htp5



ch2(type) =>

    switch type

        "Ch0" => Ltp0

        "Ch1" => Ltp1

        "Ch2" => Ltp2

        "Ch3" => Ltp3

        "Ch4" => Ltp4

        "Ch5" => Ltp5



// Plot Channel 2



ch3(type) =>

    switch type

        "Ch0" => Htp02

        "Ch1" => Htp12

        "Ch2" => Htp22

        "Ch3" => Htp32

        "Ch4" => Htp42

        "Ch5" => Htp52



ch4(type) =>

    switch type

        "Ch0" => Ltp02

        "Ch1" => Ltp12

        "Ch2" => Ltp22

        "Ch3" => Ltp32

        "Ch4" => Ltp42

        "Ch5" => Ltp52



// Plot Channel 3



ch5(type) =>

    switch type

        "Ch0" => Htp03

        "Ch1" => Htp13

        "Ch2" => Htp23

        "Ch3" => Htp33

        "Ch4" => Htp43

        "Ch5" => Htp53



ch6(type) =>

    switch type

        "Ch0" => Ltp03

        "Ch1" => Ltp13

        "Ch2" => Ltp23

        "Ch3" => Ltp33

        "Ch4" => Ltp43

        "Ch5" => Ltp53



//



ch_mode1 = input.string(title = 'Channel 1', defval = "Ch0", options = ["Ch0", "Ch1", "Ch2", "Ch3", "Ch4", "Ch5"], tooltip = "Select Source (0) or any Moving Average (1-5)", group = "============= Optimized Trend Tracker =============")

ch_mode2 = input.string(title = 'Channel 2', defval = "Ch0", options = ["Ch0", "Ch1", "Ch2", "Ch3", "Ch4", "Ch5"], tooltip = "Select Source (0) or any Moving Average (1-5)", group = "============= Optimized Trend Tracker =============")

ch_mode3 = input.string(title = 'Channel 3', defval = "Ch0", options = ["Ch0", "Ch1", "Ch2", "Ch3", "Ch4", "Ch5"], tooltip = "Select Source (0) or any Moving Average (1-5)", group = "============= Optimized Trend Tracker =============")



//=======================================================================================================================//

// Plot Channel



ch_cdH1 = show_ch1F and (hkClose > ch1(ch_mode1)[ma_os]) ? bull_ch2 : bear_ch2

ch_cdL1 = show_ch1F and (hkClose < ch2(ch_mode1)[ma_os]) ? bull_ch2 : bear_ch2



ch_cdH2 = show_ch2F and (hkClose > ch3(ch_mode2)[ma_os]) ? bull_ch2 : bear_ch2

ch_cdL2 = show_ch2F and (hkClose < ch4(ch_mode2)[ma_os]) ? bull_ch2 : bear_ch2



//



CH_h00 = plot(show_ch1 ? ch1(ch_mode1) : na, "Higher Channel 1", color = (hkClose > ch1(ch_mode1)[ma_os]) ? bull_ch : neut_ch, offset = ma_os, linewidth = 1, style = plot.style_line, join = true) // display.all - display.status_line

CH_l00 = plot(show_ch1 ? ch2(ch_mode1) : na, "Lower  Channel 1", color = (hkClose < ch2(ch_mode1)[ma_os]) ? bull_ch : neut_ch, offset = ma_os, linewidth = 1, style = plot.style_line, join = true)



CH_h02 = plot(show_ch2 ? ch3(ch_mode2) : na, "Higher Channel 2", color = (hkClose > ch3(ch_mode2)[ma_os]) ? bull_ch : bear_ch, offset = ma_os, linewidth = 1, style = plot.style_line, join = true, display = display.none)

CH_l02 = plot(show_ch2 ? ch4(ch_mode2) : na, "Lower  Channel 2", color = (hkClose < ch4(ch_mode2)[ma_os]) ? bull_ch : bear_ch, offset = ma_os, linewidth = 1, style = plot.style_line, join = true, display = display.none)





fill(CH_h00, CH_l00, ch1(ch_mode1), ch2(ch_mode1), top_color = ch_cdH1, bottom_color = ch_cdL1, title = "Channel Fill1", fillgaps = true) //

fill(CH_h02, CH_l02, ch3(ch_mode2), ch4(ch_mode2), top_color = ch_cdH2, bottom_color = ch_cdL2, title = "Channel Fill2", fillgaps = true) //



//



avgCH1 = math.avg(ch1(ch_mode1), ch2(ch_mode1))

avgCH2 = math.avg(ch3(ch_mode2), ch4(ch_mode2))



//plot(show_ch1 ? avgCH1 : na, "Middle Channel 1", color = neut_ch, offset = ma_os, linewidth = 1, style = plot.style_circles, join = true, display = display.all - display.status_line)

plot(show_ch2 ? avgCH2 : na, "Middle Channel 2", color = neut_ch2, offset = ma_os, linewidth = 1, style = plot.style_circles, join = true, display = display.all - display.status_line)



//=======================================================================================================================//

// Label



Tup1 = hkClose > ch1(ch_mode1)[ma_os] ? 1 : 0

Tup2 = hkClose > ch3(ch_mode2)[ma_os] ? 1 : 0

Tup3 = hkClose > avgCH1 ? 1 : 0

Tup4 = hkClose > avgCH2 ? 1 : 0

Tup5 = hkClose > hkOpen ? 1 : 0



Tdn1 = hkClose < ch2(ch_mode1)[ma_os] ? 1 : 0

Tdn2 = hkClose < ch4(ch_mode2)[ma_os] ? 1 : 0

Tdn3 = hkClose < avgCH1 ? 1 : 0

Tdn4 = hkClose < avgCH2 ? 1 : 0

Tdn5 = hkClose < hkOpen ? 1 : 0



Trend_ = (Tup1+Tup2+Tup3+Tup4+Tup5) - (Tdn1+Tdn2+Tdn3+Tdn4+Tdn5)

Trend = Trend_ * 100 / 5



avgCH3 = math.avg(ch5(ch_mode3), ch6(ch_mode3))

Fib31 = avgCH3 + ((ch5(ch_mode3) - ch6(ch_mode3)) * Fib1)

Fib32 = avgCH3 - ((ch5(ch_mode3) - ch6(ch_mode3)) * Fib1)



Fib33 = avgCH3 + ((ch5(ch_mode3) - ch6(ch_mode3)) * Fib2)

Fib34 = avgCH3 - ((ch5(ch_mode3) - ch6(ch_mode3)) * Fib2)



vis01 = hkClose > avgCH3 ? true : false

vis02 = hkClose < avgCH3 ? true : false



//



plot(vis01 and show_fib and show_ch3 ? ch5(ch_mode3) : na, "Higher Channel 3", color = color.from_gradient(value = Trend, bottom_value = -100, top_value = 100, bottom_color = bear_col01, top_color = bull_col01), offset = ma_os, linewidth = 2, style = plot.style_linebr, join = true)

plot(vis02 and show_fib and show_ch3 ? ch6(ch_mode3) : na, "Lower  Channel 3", color = color.from_gradient(value = Trend, bottom_value = -100, top_value = 100, bottom_color = bear_col01, top_color = bull_col01), offset = ma_os, linewidth = 2, style = plot.style_linebr, join = true)



plot(vis01 and show_fib and show_ch3 ? Fib31 : na, "Higher Fib 31", color = color.from_gradient(value = Trend, bottom_value = -100, top_value = 100, bottom_color = bear_col01, top_color = bull_col01), offset = ma_os, linewidth = 1, style = plot.style_linebr, join = false)

plot(vis02 and show_fib and show_ch3 ? Fib32 : na, "Lower  Fib 31", color = color.from_gradient(value = Trend, bottom_value = -100, top_value = 100, bottom_color = bear_col01, top_color = bull_col01), offset = ma_os, linewidth = 1, style = plot.style_linebr, join = false)



plot(vis01 and show_fib and show_ch3 ? Fib33 : na, "Higher Fib 32", color = color.from_gradient(value = Trend, bottom_value = -100, top_value = 100, bottom_color = bear_col01, top_color = bull_col01), offset = ma_os, linewidth = 1, style = plot.style_linebr, join = false)

plot(vis02 and show_fib and show_ch3 ? Fib34 : na, "Lower  Fib 32", color = color.from_gradient(value = Trend, bottom_value = -100, top_value = 100, bottom_color = bear_col01, top_color = bull_col01), offset = ma_os, linewidth = 1, style = plot.style_linebr, join = false)



plot(show_ch3 ? avgCH3 : na, "Middle Channel 3", color = color.from_gradient(value = Trend, bottom_value = -100, top_value = 100, bottom_color = bear_col01, top_color = bull_col01), offset = ma_os, linewidth = 1, style = plot.style_cross, join = true)



//=======================================================================================================================//

// Plot

// MA



col01_ = sslUp01 > sslDn01 ? bull_col01 : sslUp01 < sslDn01 ? bear_col01 : color.gray //src

col02_ = sslUp02 > sslDn02 ? bull_col01 : sslUp02 < sslDn02 ? bear_col01 : color.gray

col03_ = sslUp03 > sslDn03 ? bull_col01 : sslUp03 < sslDn03 ? bear_col01 : color.gray



// HTF



col04_ = htf04H > htf04L ? bull_col01 : htf04H < htf04L ? bear_col01 : color.gray

col05_ = htf05H > htf05L ? bull_col01 : htf05H < htf05L ? bear_col01 : color.gray



//



plot_bs2 = plot(show_mas2 ? ssl02 : na, "HTF Sslch MA2", color = col02_, offset = ma_os, linewidth = 2, display = display.all - display.status_line) //#ff6d00

plot_bs3 = plot(show_mas3 ? ssl03 : na, "HTF Sslch MA3", color = col03_, offset = ma_os, linewidth = 3, display = display.all - display.status_line) //#b34c00

plot_bs4 = plot(show_mas4 ? ssl04 : na, "HTF Sslch MA4", color = col04_, offset = ma_os, linewidth = 4, display = display.all - display.status_line) //#b34c00

plot_bs5 = plot(show_mas5 ? ssl05 : na, "HTF Sslch MA5", color = col05_, offset = ma_os, linewidth = 5, display = display.all - display.status_line)



//=======================================================================================================================//

// Pvsra 

// Author: Creengrack



//showPvsra = input(true, 'Show Pvsra', group = "======== Price, Volume, S&R Analysis ========")

//showNbar = input(false, "Secondary Bars", group = "======== Price, Volume, S&R Analysis ========")



//hist_mav0 = input.int(128, 'Pvsra Length', group = "======== Price, Volume, S&R Analysis ========")

//pvsra_trp = input.int(50, 'Pvsra Transparency', minval = 0, maxval = 100, step = 1, group = "======== Price, Volume, S&R Analysis ========")



//bool overridesym = input(title = 'Pvsra Override chart symbol?', defval = false, group = "======== Price, Volume, S&R Analysis ========")

//string pvsra_sym = input.symbol(title = 'Pvsra Symbol', defval = 'INDEX:BTCUSD', group = "======== Price, Volume, S&R Analysis ========")



//pvsra_security(sresolution, sseries) =>

//    request.security(overridesym ? pvsra_sym : syminfo.tickerid, sresolution, sseries[barstate.isrealtime ? 1 : 0], barmerge.gaps_off, barmerge.lookahead_off)

//pvsra_security_1 = pvsra_security('', volume)

//pvsra_volume = overridesym == true ? pvsra_security_1 : volume

//pvsra_security_2 = pvsra_security('', high)

//pvsra_high = overridesym == true ? pvsra_security_2 : high

//pvsra_security_3 = pvsra_security('', low)

//pvsra_low = overridesym == true ? pvsra_security_3 : low

//pvsra_security_4 = pvsra_security('', close)

//pvsra_close = overridesym == true ? pvsra_security_4 : close

//pvsra_security_5 = pvsra_security('', open)

//pvsra_open = overridesym == true ? pvsra_security_5 : open



//sum_1 = math.sum(pvsra_volume, hist_mav0)

//sum_2 = math.sum(volume, hist_mav0)

//av = overridesym == true ? sum_1 / hist_mav0 : sum_2 / hist_mav0

////climax volume on the previous candle

//value2 = overridesym == true ? pvsra_volume * (pvsra_high - pvsra_low) : volume * (high - low)

//// highest climax volume of the last 10 candles

//hivalue2 = ta.highest(value2, hist_mav0)

//// VA value determines the bar color. va = 0: normal. va = 1: climax.  va = 2: rising

//iff_1 = pvsra_volume >= av * 1.5 ? 2 : 0 // 1.5 / 2

//iff_2 = pvsra_volume >= av * 2 or value2 >= hivalue2 ? 1 : iff_1 // 2 / 1

//iff_3 = volume >= av * 1.5 ? 2 : 0 // 1.5 / 2

//iff_4 = volume >= av * 2 or value2 >= hivalue2 ? 1 : iff_3 // 2

//va = overridesym == true ? iff_2 : iff_4



// Bullish or bearish coloring



//isBull = overridesym == true ? pvsra_close > pvsra_open : close > open



//O = open

//H = high

//L = low

//C = close



//



//CUColor = showPvsra ? bull_col_ : neut_cl // Climax up (bull) bull and bear both start with b so it would be weird hence up down

//CDColor = showPvsra ? bear_col_ : neut_cl  // Climax down (bear)

//AUColor = showPvsra ? bull_cl : neut_cl  //Avobe average up (bull) #14ff00

//ADColor = showPvsra ? bear_cl : neut_cl  //Above average down (bear)) #ff0500



//NUColor = showNbar ? #7a7a7a : na

//NDColor = showNbar ? #3d3d3d : na // neut_cl



// 



//iff_5 = va == 2 ? AUColor : NUColor

//iff_6 = va == 1 ? CUColor : iff_5

//iff_7 = va == 2 ? ADColor : NDColor

//iff_8 = va == 1 ? CDColor : iff_7



//candleColor = isBull ? iff_6 : iff_8



//trLib.rLabel(high - (high - low) / 2, 'PVSRA Override Active!', label.style_none, color.orange, overrideSym, labelXOffset)  //ry, rtext, rstyle, rcolor, valid



pvsraVolume(overrideSymbolX, pvsraSymbolX, tickerIdX) =>

    request.security(overrideSymbolX ? pvsraSymbolX : tickerIdX, '', [volume,high,low,close,open], barmerge.gaps_off, barmerge.lookahead_off)



[pvsraVolume, pvsraHigh, pvsraLow, pvsraClose, pvsraOpen]  = pvsraVolume(overrideSym, pvsraSym, syminfo.tickerid)



[pvsraColor, alertFlag, averageVolume, volumeSpread, highestVolumeSpread] = trLib.calcPvsra(pvsraVolume, pvsraHigh, pvsraLow, pvsraClose, pvsraOpen, redVectorColor, greenVectorColor, violetVectorColor, blueVectorColor, regularCandleDownColor, regularCandleUpColor)

barcolor(pvsraColor)



alertcondition(alertFlag, title='Alert on Any Vector Candle', message='{{ticker}} Vector Candle on the {{interval}}')



alertcondition(pvsraColor == greenVectorColor, title='Green Vector Candle', message='{{ticker}} Green Vector Candle on the {{interval}} Note: alert triggers in real time before the candle is closed unless you choose "once per bar close" option - ie the alert might trigger at some point and the pa after that could change the vector color completely. Use with caution.')

alertcondition(pvsraColor == redVectorColor, title='Red Vector Candle', message='{{ticker}} Red Vector Candle on the {{interval}} Note: alert triggers in real time before the candle is closed unless you choose "once per bar close" option- ie the alert might trigger at some point and the pa after that could change the vector color completely. Use with caution.')

alertcondition(pvsraColor == blueVectorColor, title='Blue Vector Candle', message='{{ticker}} Blue Vector Candle on the {{interval}} Note: alert triggers in real time before the candle is closed unless you choose "once per bar close" option- ie the alert might trigger at some point and the pa after that could change the vector color completely. Use with caution.')

alertcondition(pvsraColor == violetVectorColor, title='Purple Vector Candle', message='{{ticker}} Purple Vector Candle on the {{interval}} Note: alert triggers in real time before the candle is closed unless you choose "once per bar close" option- ie the alert might trigger at some point and the pa after that could change the vector color completely. Use with caution.')



redGreen = pvsraColor == greenVectorColor and pvsraColor[1] == redVectorColor

greenRed = pvsraColor == redVectorColor and pvsraColor[1] == greenVectorColor

redBlue = pvsraColor == blueVectorColor and pvsraColor[1] == redVectorColor

blueRed = pvsraColor == redVectorColor and pvsraColor[1] == blueVectorColor

greenPurpule = pvsraColor ==  violetVectorColor and pvsraColor[1] == greenVectorColor

purpleGreen = pvsraColor ==  greenVectorColor and pvsraColor[1] == violetVectorColor

bluePurpule = pvsraColor ==  violetVectorColor and pvsraColor[1] == blueVectorColor

purpleBlue = pvsraColor == blueVectorColor and pvsraColor[1] == violetVectorColor

greenGreen = pvsraColor == greenVectorColor and pvsraColor[1] == greenVectorColor

redRed = pvsraColor == redVectorColor and pvsraColor[1] == redVectorColor





alertcondition(redGreen, title='Red/Green Vector Candle Pattern', message='{{ticker}} Red/Green Vector Candle Pattern on the {{interval}}')

alertcondition(greenRed, title='Green/Red Vector Candle Pattern', message='{{ticker}} Green/Red Vector Candle Pattern on the {{interval}}')

alertcondition(redBlue, title='Red/Blue Vector Candle Pattern', message='{{ticker}} Red/Blue Vector Candle Pattern on the {{interval}}')

alertcondition(blueRed, title='Blue/Red Vector Candle Pattern', message='{{ticker}} Blue/Red Vector Candle Pattern on the {{interval}}')

alertcondition(greenPurpule, title='Green/Purple Vector Candle Pattern', message='{{ticker}} Green/Purple Vector Candle Pattern on the {{interval}}')

alertcondition(purpleGreen, title='Purple/Green Vector Candle Pattern', message='{{ticker}} Purple/Green Vector Candle Pattern on the {{interval}}')

alertcondition(bluePurpule, title='Blue/Purple Vector Candle Pattern', message='{{ticker}} Blue/Purple Vector Candle Pattern on the {{interval}}')

alertcondition(purpleBlue, title='Purple/Blue Vector Candle Pattern', message='{{ticker}} Purple/Blue Vector Candle Pattern on the {{interval}}')

alertcondition(greenGreen, title='Green/Green Vector Candle Pattern', message='{{ticker}} Green/Green Vector Candle Pattern on the {{interval}}')

alertcondition(redRed, title='Red/Red Vector Candle Pattern', message='{{ticker}} Red/Red Vector Candle Pattern on the {{interval}}')





//pvsraVolume(overrideSymbolX, pvsraSymbolX, tickerIdX) =>

//    request.security(overrideSymbolX ? pvsraSymbolX : tickerIdX, '', [volume,high,low,close,open], barmerge.gaps_off, barmerge.lookahead_off)



//[pvsraVolume, pvsraHigh, pvsraLow, pvsraClose, pvsraOpen]  = pvsraVolume(overrideSym, pvsraSym, syminfo.tickerid)



//[pvsraColor, alertFlag, averageVolume, volumeSpread, highestVolumeSpread] = trLib.calcPvsra(pvsraVolume, pvsraHigh, pvsraLow, pvsraClose, pvsraOpen, redVectorColor, greenVectorColor, violetVectorColor, blueVectorColor, regularCandleDownColor, regularCandleUpColor)

//barcolor(pvsraColor)



//=======================================================================================================================//

// Plot

// MA



//plot(show_mas1 ? ssl01 : na, "HTF Sslch MA1 B/W", color = cd_col3, linewidth = 2, display = display.all - display.status_line)

plot_bs1 = plot(show_mas1 ? ssl01 : na, "HTF Sslch MA1", color = col01_, linewidth = 1, display = display.all - display.status_line)



//=======================================================================================================================//

// Heikin Ashi (Long/Short) I



//cond_A1 = hkOpen < hkClose

//cond_A2 = hkOpen > hkClose



//long_A1 = cond_A1 == true

//shrt_A1 = cond_A2 == true



//



//a1_since_long  = ta.barssince(cond_A1) [1]

//a1_since_short = ta.barssince(cond_A2) [1]



//



//long_condition_A1 = 0

//long_count_A1 = 1



//if(cond_A1)

//    if(bool(long_count_A1))

//        long_count_A1 := long_count_A1 - 1

//        if long_A1 and a1_since_long > a1_since_short

//            long_condition_A1 := long_condition_A1 + 1

//        else

//            long_condition_A1 := long_condition_A1 - 1    



//lA01 = long_condition_A1 > 0 



//



//short_condition_A1 = 0

//short_count_A1 = 1



//if(cond_A2)

//    if(bool(short_count_A1))

//        short_count_A1 := short_count_A1 - 1

//        if shrt_A1 and a1_since_short > a1_since_long

//            short_condition_A1 := short_condition_A1 + 1

//        else

//            short_condition_A1 := short_condition_A1 - 1    



//sA01 = short_condition_A1 > 0 



//=======================================================================================================================//

//=======================================================================================================================//

// Alerts

// Heikin Ashi I Alerts



//alertcondition(lA01 or sA01, 'Heikin Ashi Alert', 'Heikin Ashi Alert')



// PVSRA



//alertcondition(va > 0, title = 'PVSRA Alert on Vector Candle', message = 'Pvsra Alert on Vector Candle') 



// Total



//alertcondition((va > 0) or lA01 or sA01, title='Heikin Ashi + Pvsra Detected', message='Heikin Ashi and Divergence + Pvsra Detected')



//=======================================================================================================================//

//=======================================================================================================================//

// Table



//cond01 = (lA01 == true) or (sA01 == true) ? "■" : na

//cond02 = (va > 0) == true ? "■" : na



//



//drawTester = input(true, title = "Table", group = "============= Table =============")

//mode_size = input.string(defval = "Tiny", options = ["Tiny", "Small", "Normal", "Large"], title = "Oscillator 1", group = "============= Table =============")



//TextSize(type) =>

//    switch type

//        "Tiny" => size.tiny

//        "Small" => size.small

//        "Normal" => size.normal

//        "Large" => size.large



//TextSize1(type) =>

//    switch type

//        "Tiny" => 0

//        "Small" => 1

//        "Normal" => 2

//        "Large" => 3



// We use \`var\` to only initialize the table on the first bar.



//var table atrDisplay = table.new(position.middle_left, 5, 4)



// Call 



//if barstate.islast



//if drawTester

    // We only populate the table on the last bar.

//    table.cell(atrDisplay, column = 0, row = 0, text = "HAshi", width = 6 + TextSize1(mode_size), height = 0, text_color = #ffffff, text_halign = text.align_center, text_valign = text.align_center, text_size = TextSize(mode_size), bgcolor = #333333)

//    table.cell(atrDisplay, column = 0, row = 1, text = "PVSRA", width = 6 + TextSize1(mode_size), height = 0, text_color = #ffffff, text_halign = text.align_center, text_valign = text.align_center, text_size = TextSize(mode_size), bgcolor = #333333)



//    table.cell(atrDisplay, column = 1, row = 0, text = str.tostring(cond01), width = 0 + TextSize1(mode_size), height = 0, text_color = #ffffff, text_halign = text.align_center, text_valign = text.align_center, text_size = TextSize(mode_size), bgcolor = #333333)

//    table.cell(atrDisplay, column = 1, row = 1, text = str.tostring(cond02), width = 0 + TextSize1(mode_size), height = 0, text_color = #ffffff, text_halign = text.align_center, text_valign = text.align_center, text_size = TextSize(mode_size), bgcolor = #333333)



//Vector Candle Zones

var zoneBoxesAbove = array.new_box()

var zoneBoxesBelow = array.new_box()

if showVCZ

    pvsra = trLib.getPvsraFlagByColor(pvsraColor, redVectorColor, greenVectorColor, violetVectorColor, blueVectorColor, regularCandleUpColor)

    trLib.updateZones(pvsra, 0, zoneBoxesBelow, zonesMax, pvsraHigh, pvsraLow, pvsraOpen, pvsraClose, transperancy, zoneUpdateType, zoneColor, zoneType, borderWidth, colorOverride, redVectorColor, greenVectorColor, violetVectorColor, blueVectorColor)

    trLib.updateZones(pvsra, 1, zoneBoxesAbove, zonesMax, pvsraHigh, pvsraLow, pvsraOpen, pvsraClose, transperancy, zoneUpdateType, zoneColor, zoneType, borderWidth, colorOverride, redVectorColor, greenVectorColor, violetVectorColor, blueVectorColor)

    trLib.cleanarr(zoneBoxesAbove)

    trLib.cleanarr(zoneBoxesBelow)



//=======================================================================================================================//

// END

// CryptoQuebec [StefB]


// ============================================================================
// CQ VECTOR MTF - TABLEAU VISUEL (AJOUT INDEPENDANT)
// ============================================================================
cqGroup = "CQ Vector MTF - Tableau"
cqShow = input.bool(true, "Afficher tableau CQ VECTOR", group=cqGroup)
cqPosInput = input.string("Haut droite", "Position", options=["Haut gauche", "Haut centre", "Haut droite", "Milieu gauche", "Milieu centre", "Milieu droite", "Bas gauche", "Bas centre", "Bas droite"], group=cqGroup)
cqTextInput = input.string("Normal", "Taille texte", options=["Petit", "Normal", "Grand"], group=cqGroup)

cqPos = switch cqPosInput
    "Haut gauche" => position.top_left
    "Haut centre" => position.top_center
    "Milieu gauche" => position.middle_left
    "Milieu centre" => position.middle_center
    "Milieu droite" => position.middle_right
    "Bas gauche" => position.bottom_left
    "Bas centre" => position.bottom_center
    "Bas droite" => position.bottom_right
    => position.top_right
cqSize = switch cqTextInput
    "Petit" => size.small
    "Grand" => size.large
    => size.normal

// Meme moteur PVSRA que les chandelles du Vector + OTT original.
// La bibliotheque determine elle-meme les seuils et la classification.
cqMtfData() =>
    [vColor, vAlert, vAverage, vSpread, vHighest] = trLib.calcPvsra(volume, high, low, close, open, redVectorColor, greenVectorColor, violetVectorColor, blueVectorColor, regularCandleDownColor, regularCandleUpColor)
    float rel = not na(vAverage) and vAverage > 0 ? volume / vAverage * 100.0 : na
    [rel, close > open, vColor, time_close]

[cqVol1, cqBull1, cqColor1, cqClose1] = request.security(syminfo.tickerid, "60", cqMtfData())
[cqVol4, cqBull4, cqColor4, cqClose4] = request.security(syminfo.tickerid, "240", cqMtfData())
[cqVol12, cqBull12, cqColor12, cqClose12] = request.security(syminfo.tickerid, "720", cqMtfData())
[cqVolD, cqBullD, cqColorD, cqCloseD] = request.security(syminfo.tickerid, "D", cqMtfData())
[cqVolW, cqBullW, cqColorW, cqCloseW] = request.security(syminfo.tickerid, "W", cqMtfData())

cqStatus(color vectorColor) =>
    vectorColor == greenVectorColor ? "BULL HIGH" : vectorColor == redVectorColor ? "BEAR HIGH" : vectorColor == blueVectorColor ? "BULL MID" : vectorColor == violetVectorColor ? "BEAR MID" : "NONE"

cqClock(int closing) =>
    string result = "N/D"
    if barstate.isrealtime and not na(closing)
        int seconds = int(math.max(0, closing - timenow) / 1000)
        int days = int(seconds / 86400)
        int hours = int((seconds % 86400) / 3600)
        int minutes = int((seconds % 3600) / 60)
        int secs = seconds % 60
        string hhmmss = str.tostring(hours, "00") + ":" + str.tostring(minutes, "00") + ":" + str.tostring(secs, "00")
        result := days > 0 ? str.tostring(days) + "d " + hhmmss : hhmmss
    result

cqHeader = color.rgb(31, 65, 83)
cqCell = color.rgb(67, 89, 101)
cqCellAlt = color.rgb(74, 94, 105)
cqBlue = color.rgb(0, 141, 239)
cqCyan = color.rgb(48, 174, 219)
cqGrid = color.rgb(169, 188, 193)
cqWhite = color.white

cqRow(table t, int row, string tf, float rel, bool bull, color vectorColor, int closing) =>
    string state = cqStatus(vectorColor)
    color base = row % 2 == 0 ? cqCellAlt : cqCell
    color stateBg = state == "NONE" ? base : str.contains(state, "HIGH") ? color.rgb(0, 113, 174) : cqBlue
    color directionColor = bull ? color.lime : color.rgb(255, 84, 100)
    table.cell(t, 0, row, tf, bgcolor=base, text_color=cqWhite, text_size=cqSize, text_halign=text.align_center)
    table.cell(t, 1, row, bull ? "▲" : "▼", bgcolor=base, text_color=directionColor, text_size=cqSize, text_halign=text.align_center)
    table.cell(t, 2, row, state, bgcolor=stateBg, text_color=cqWhite, text_size=cqSize, text_halign=text.align_center)
    table.cell(t, 3, row, na(rel) ? "N/D" : str.tostring(rel, "#") + "%", bgcolor=base, text_color=cqWhite, text_size=cqSize, text_halign=text.align_center)
    table.cell(t, 4, row, cqClock(closing), bgcolor=base, text_color=cqWhite, text_size=cqSize, text_halign=text.align_center)

var table cqVectorTable = table.new(cqPos, 5, 7, bgcolor=cqCell, frame_color=cqGrid, frame_width=2, border_color=cqGrid, border_width=1)
if barstate.islast
    if cqShow
        table.cell(cqVectorTable, 0, 0, "CQ VECTOR", bgcolor=cqHeader, text_color=cqWhite, text_size=cqSize)
        table.cell(cqVectorTable, 1, 0, "DIR", bgcolor=cqHeader, text_color=cqWhite, text_size=cqSize)
        table.cell(cqVectorTable, 2, 0, "STATUS", bgcolor=cqHeader, text_color=cqWhite, text_size=cqSize)
        table.cell(cqVectorTable, 3, 0, "VOL %", bgcolor=cqHeader, text_color=cqWhite, text_size=cqSize)
        table.cell(cqVectorTable, 4, 0, "CLOSE", bgcolor=cqHeader, text_color=cqWhite, text_size=cqSize)
        cqRow(cqVectorTable, 1, "1H", cqVol1, cqBull1, cqColor1, cqClose1)
        cqRow(cqVectorTable, 2, "4H", cqVol4, cqBull4, cqColor4, cqClose4)
        cqRow(cqVectorTable, 3, "12H", cqVol12, cqBull12, cqColor12, cqClose12)
        cqRow(cqVectorTable, 4, "1D", cqVolD, cqBullD, cqColorD, cqCloseD)
        cqRow(cqVectorTable, 5, "1W", cqVolW, cqBullW, cqColorW, cqCloseW)
        int activeCount = (cqStatus(cqColor1) != "NONE" ? 1 : 0) + (cqStatus(cqColor4) != "NONE" ? 1 : 0) + (cqStatus(cqColor12) != "NONE" ? 1 : 0) + (cqStatus(cqColorD) != "NONE" ? 1 : 0) + (cqStatus(cqColorW) != "NONE" ? 1 : 0)
        table.cell(cqVectorTable, 0, 6, "TOTAL", bgcolor=cqCell, text_color=cqWhite, text_size=cqSize)
        table.cell(cqVectorTable, 1, 6, "", bgcolor=cqCell)
        table.cell(cqVectorTable, 2, 6, str.tostring(activeCount) + " TF", bgcolor=cqCyan, text_color=cqWhite, text_size=cqSize)
        table.cell(cqVectorTable, 3, 6, str.tostring(activeCount) + "/5", bgcolor=cqCyan, text_color=cqWhite, text_size=cqSize)
        table.cell(cqVectorTable, 4, 6, "", bgcolor=cqCell)
    else
        table.clear(cqVectorTable, 0, 0, 4, 6)

