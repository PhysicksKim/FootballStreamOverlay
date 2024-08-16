import { Team } from '@src/types/types';

// #region country flags imports
import adFlag from '@assets/flags/country/1x1/ad.svg';
import aeFlag from '@assets/flags/country/1x1/ae.svg';
import afFlag from '@assets/flags/country/1x1/af.svg';
import agFlag from '@assets/flags/country/1x1/ag.svg';
import aiFlag from '@assets/flags/country/1x1/ai.svg';
import alFlag from '@assets/flags/country/1x1/al.svg';
import amFlag from '@assets/flags/country/1x1/am.svg';
import aoFlag from '@assets/flags/country/1x1/ao.svg';
import aqFlag from '@assets/flags/country/1x1/aq.svg';
import arFlag from '@assets/flags/country/1x1/ar.svg';
import arabFlag from '@assets/flags/country/1x1/arab.svg';
import asFlag from '@assets/flags/country/1x1/as.svg';
import atFlag from '@assets/flags/country/1x1/at.svg';
import auFlag from '@assets/flags/country/1x1/au.svg';
import awFlag from '@assets/flags/country/1x1/aw.svg';
import axFlag from '@assets/flags/country/1x1/ax.svg';
import azFlag from '@assets/flags/country/1x1/az.svg';
import baFlag from '@assets/flags/country/1x1/ba.svg';
import bbFlag from '@assets/flags/country/1x1/bb.svg';
import bdFlag from '@assets/flags/country/1x1/bd.svg';
import beFlag from '@assets/flags/country/1x1/be.svg';
import bfFlag from '@assets/flags/country/1x1/bf.svg';
import bgFlag from '@assets/flags/country/1x1/bg.svg';
import bhFlag from '@assets/flags/country/1x1/bh.svg';
import biFlag from '@assets/flags/country/1x1/bi.svg';
import bjFlag from '@assets/flags/country/1x1/bj.svg';
import blFlag from '@assets/flags/country/1x1/bl.svg';
import bmFlag from '@assets/flags/country/1x1/bm.svg';
import bnFlag from '@assets/flags/country/1x1/bn.svg';
import boFlag from '@assets/flags/country/1x1/bo.svg';
import bqFlag from '@assets/flags/country/1x1/bq.svg';
import brFlag from '@assets/flags/country/1x1/br.svg';
import bsFlag from '@assets/flags/country/1x1/bs.svg';
import btFlag from '@assets/flags/country/1x1/bt.svg';
import bvFlag from '@assets/flags/country/1x1/bv.svg';
import bwFlag from '@assets/flags/country/1x1/bw.svg';
import byFlag from '@assets/flags/country/1x1/by.svg';
import bzFlag from '@assets/flags/country/1x1/bz.svg';
import caFlag from '@assets/flags/country/1x1/ca.svg';
import ccFlag from '@assets/flags/country/1x1/cc.svg';
import cdFlag from '@assets/flags/country/1x1/cd.svg';
import ceftaFlag from '@assets/flags/country/1x1/cefta.svg';
import cfFlag from '@assets/flags/country/1x1/cf.svg';
import cgFlag from '@assets/flags/country/1x1/cg.svg';
import chFlag from '@assets/flags/country/1x1/ch.svg';
import ciFlag from '@assets/flags/country/1x1/ci.svg';
import ckFlag from '@assets/flags/country/1x1/ck.svg';
import clFlag from '@assets/flags/country/1x1/cl.svg';
import cmFlag from '@assets/flags/country/1x1/cm.svg';
import cnFlag from '@assets/flags/country/1x1/cn.svg';
import coFlag from '@assets/flags/country/1x1/co.svg';
import cpFlag from '@assets/flags/country/1x1/cp.svg';
import crFlag from '@assets/flags/country/1x1/cr.svg';
import cuFlag from '@assets/flags/country/1x1/cu.svg';
import cvFlag from '@assets/flags/country/1x1/cv.svg';
import cwFlag from '@assets/flags/country/1x1/cw.svg';
import cxFlag from '@assets/flags/country/1x1/cx.svg';
import cyFlag from '@assets/flags/country/1x1/cy.svg';
import czFlag from '@assets/flags/country/1x1/cz.svg';
import deFlag from '@assets/flags/country/1x1/de.svg';
import dgFlag from '@assets/flags/country/1x1/dg.svg';
import djFlag from '@assets/flags/country/1x1/dj.svg';
import dkFlag from '@assets/flags/country/1x1/dk.svg';
import dmFlag from '@assets/flags/country/1x1/dm.svg';
import doFlag from '@assets/flags/country/1x1/do.svg';
import dzFlag from '@assets/flags/country/1x1/dz.svg';
import eacFlag from '@assets/flags/country/1x1/eac.svg';
import ecFlag from '@assets/flags/country/1x1/ec.svg';
import eeFlag from '@assets/flags/country/1x1/ee.svg';
import egFlag from '@assets/flags/country/1x1/eg.svg';
import ehFlag from '@assets/flags/country/1x1/eh.svg';
import erFlag from '@assets/flags/country/1x1/er.svg';
import esFlag from '@assets/flags/country/1x1/es.svg';
import esctFlag from '@assets/flags/country/1x1/esct.svg';
import esgaFlag from '@assets/flags/country/1x1/esga.svg';
import espvFlag from '@assets/flags/country/1x1/espv.svg';
import etFlag from '@assets/flags/country/1x1/et.svg';
import euFlag from '@assets/flags/country/1x1/eu.svg';
import fiFlag from '@assets/flags/country/1x1/fi.svg';
import fjFlag from '@assets/flags/country/1x1/fj.svg';
import fkFlag from '@assets/flags/country/1x1/fk.svg';
import fmFlag from '@assets/flags/country/1x1/fm.svg';
import foFlag from '@assets/flags/country/1x1/fo.svg';
import frFlag from '@assets/flags/country/1x1/fr.svg';
import gaFlag from '@assets/flags/country/1x1/ga.svg';
import gbFlag from '@assets/flags/country/1x1/gb.svg';
import gbengFlag from '@assets/flags/country/1x1/gbeng.svg';
import gbnirFlag from '@assets/flags/country/1x1/gbnir.svg';
import gbsctFlag from '@assets/flags/country/1x1/gbsct.svg';
import gbwlsFlag from '@assets/flags/country/1x1/gbwls.svg';
import gdFlag from '@assets/flags/country/1x1/gd.svg';
import geFlag from '@assets/flags/country/1x1/ge.svg';
import gfFlag from '@assets/flags/country/1x1/gf.svg';
import ggFlag from '@assets/flags/country/1x1/gg.svg';
import ghFlag from '@assets/flags/country/1x1/gh.svg';
import giFlag from '@assets/flags/country/1x1/gi.svg';
import glFlag from '@assets/flags/country/1x1/gl.svg';
import gmFlag from '@assets/flags/country/1x1/gm.svg';
import gnFlag from '@assets/flags/country/1x1/gn.svg';
import gpFlag from '@assets/flags/country/1x1/gp.svg';
import gqFlag from '@assets/flags/country/1x1/gq.svg';
import grFlag from '@assets/flags/country/1x1/gr.svg';
import gsFlag from '@assets/flags/country/1x1/gs.svg';
import gtFlag from '@assets/flags/country/1x1/gt.svg';
import guFlag from '@assets/flags/country/1x1/gu.svg';
import gwFlag from '@assets/flags/country/1x1/gw.svg';
import gyFlag from '@assets/flags/country/1x1/gy.svg';
import hkFlag from '@assets/flags/country/1x1/hk.svg';
import hmFlag from '@assets/flags/country/1x1/hm.svg';
import hnFlag from '@assets/flags/country/1x1/hn.svg';
import hrFlag from '@assets/flags/country/1x1/hr.svg';
import htFlag from '@assets/flags/country/1x1/ht.svg';
import huFlag from '@assets/flags/country/1x1/hu.svg';
import icFlag from '@assets/flags/country/1x1/ic.svg';
import idFlag from '@assets/flags/country/1x1/id.svg';
import ieFlag from '@assets/flags/country/1x1/ie.svg';
import ilFlag from '@assets/flags/country/1x1/il.svg';
import imFlag from '@assets/flags/country/1x1/im.svg';
import inFlag from '@assets/flags/country/1x1/in.svg';
import ioFlag from '@assets/flags/country/1x1/io.svg';
import iqFlag from '@assets/flags/country/1x1/iq.svg';
import irFlag from '@assets/flags/country/1x1/ir.svg';
import isFlag from '@assets/flags/country/1x1/is.svg';
import itFlag from '@assets/flags/country/1x1/it.svg';
import jeFlag from '@assets/flags/country/1x1/je.svg';
import jmFlag from '@assets/flags/country/1x1/jm.svg';
import joFlag from '@assets/flags/country/1x1/jo.svg';
import jpFlag from '@assets/flags/country/1x1/jp.svg';
import keFlag from '@assets/flags/country/1x1/ke.svg';
import kgFlag from '@assets/flags/country/1x1/kg.svg';
import khFlag from '@assets/flags/country/1x1/kh.svg';
import kiFlag from '@assets/flags/country/1x1/ki.svg';
import kmFlag from '@assets/flags/country/1x1/km.svg';
import knFlag from '@assets/flags/country/1x1/kn.svg';
import kpFlag from '@assets/flags/country/1x1/kp.svg';
import krFlag from '@assets/flags/country/1x1/kr.svg';
import kwFlag from '@assets/flags/country/1x1/kw.svg';
import kyFlag from '@assets/flags/country/1x1/ky.svg';
import kzFlag from '@assets/flags/country/1x1/kz.svg';
import laFlag from '@assets/flags/country/1x1/la.svg';
import lbFlag from '@assets/flags/country/1x1/lb.svg';
import lcFlag from '@assets/flags/country/1x1/lc.svg';
import liFlag from '@assets/flags/country/1x1/li.svg';
import lkFlag from '@assets/flags/country/1x1/lk.svg';
import lrFlag from '@assets/flags/country/1x1/lr.svg';
import lsFlag from '@assets/flags/country/1x1/ls.svg';
import ltFlag from '@assets/flags/country/1x1/lt.svg';
import luFlag from '@assets/flags/country/1x1/lu.svg';
import lvFlag from '@assets/flags/country/1x1/lv.svg';
import lyFlag from '@assets/flags/country/1x1/ly.svg';
import maFlag from '@assets/flags/country/1x1/ma.svg';
import mcFlag from '@assets/flags/country/1x1/mc.svg';
import mdFlag from '@assets/flags/country/1x1/md.svg';
import meFlag from '@assets/flags/country/1x1/me.svg';
import mfFlag from '@assets/flags/country/1x1/mf.svg';
import mgFlag from '@assets/flags/country/1x1/mg.svg';
import mhFlag from '@assets/flags/country/1x1/mh.svg';
import mkFlag from '@assets/flags/country/1x1/mk.svg';
import mlFlag from '@assets/flags/country/1x1/ml.svg';
import mmFlag from '@assets/flags/country/1x1/mm.svg';
import mnFlag from '@assets/flags/country/1x1/mn.svg';
import moFlag from '@assets/flags/country/1x1/mo.svg';
import mpFlag from '@assets/flags/country/1x1/mp.svg';
import mqFlag from '@assets/flags/country/1x1/mq.svg';
import mrFlag from '@assets/flags/country/1x1/mr.svg';
import msFlag from '@assets/flags/country/1x1/ms.svg';
import mtFlag from '@assets/flags/country/1x1/mt.svg';
import muFlag from '@assets/flags/country/1x1/mu.svg';
import mvFlag from '@assets/flags/country/1x1/mv.svg';
import mwFlag from '@assets/flags/country/1x1/mw.svg';
import mxFlag from '@assets/flags/country/1x1/mx.svg';
import myFlag from '@assets/flags/country/1x1/my.svg';
import mzFlag from '@assets/flags/country/1x1/mz.svg';
import naFlag from '@assets/flags/country/1x1/na.svg';
import ncFlag from '@assets/flags/country/1x1/nc.svg';
import neFlag from '@assets/flags/country/1x1/ne.svg';
import nfFlag from '@assets/flags/country/1x1/nf.svg';
import ngFlag from '@assets/flags/country/1x1/ng.svg';
import niFlag from '@assets/flags/country/1x1/ni.svg';
import nlFlag from '@assets/flags/country/1x1/nl.svg';
import noFlag from '@assets/flags/country/1x1/no.svg';
import npFlag from '@assets/flags/country/1x1/np.svg';
import nrFlag from '@assets/flags/country/1x1/nr.svg';
import nuFlag from '@assets/flags/country/1x1/nu.svg';
import nzFlag from '@assets/flags/country/1x1/nz.svg';
import omFlag from '@assets/flags/country/1x1/om.svg';
import paFlag from '@assets/flags/country/1x1/pa.svg';
import pcFlag from '@assets/flags/country/1x1/pc.svg';
import peFlag from '@assets/flags/country/1x1/pe.svg';
import pfFlag from '@assets/flags/country/1x1/pf.svg';
import pgFlag from '@assets/flags/country/1x1/pg.svg';
import phFlag from '@assets/flags/country/1x1/ph.svg';
import pkFlag from '@assets/flags/country/1x1/pk.svg';
import plFlag from '@assets/flags/country/1x1/pl.svg';
import pmFlag from '@assets/flags/country/1x1/pm.svg';
import pnFlag from '@assets/flags/country/1x1/pn.svg';
import prFlag from '@assets/flags/country/1x1/pr.svg';
import psFlag from '@assets/flags/country/1x1/ps.svg';
import ptFlag from '@assets/flags/country/1x1/pt.svg';
import pwFlag from '@assets/flags/country/1x1/pw.svg';
import pyFlag from '@assets/flags/country/1x1/py.svg';
import qaFlag from '@assets/flags/country/1x1/qa.svg';
import reFlag from '@assets/flags/country/1x1/re.svg';
import roFlag from '@assets/flags/country/1x1/ro.svg';
import rsFlag from '@assets/flags/country/1x1/rs.svg';
import ruFlag from '@assets/flags/country/1x1/ru.svg';
import rwFlag from '@assets/flags/country/1x1/rw.svg';
import saFlag from '@assets/flags/country/1x1/sa.svg';
import sbFlag from '@assets/flags/country/1x1/sb.svg';
import scFlag from '@assets/flags/country/1x1/sc.svg';
import sdFlag from '@assets/flags/country/1x1/sd.svg';
import seFlag from '@assets/flags/country/1x1/se.svg';
import sgFlag from '@assets/flags/country/1x1/sg.svg';
import shFlag from '@assets/flags/country/1x1/sh.svg';
import shacFlag from '@assets/flags/country/1x1/shac.svg';
import shhlFlag from '@assets/flags/country/1x1/shhl.svg';
import shtaFlag from '@assets/flags/country/1x1/shta.svg';
import siFlag from '@assets/flags/country/1x1/si.svg';
import sjFlag from '@assets/flags/country/1x1/sj.svg';
import skFlag from '@assets/flags/country/1x1/sk.svg';
import slFlag from '@assets/flags/country/1x1/sl.svg';
import smFlag from '@assets/flags/country/1x1/sm.svg';
import snFlag from '@assets/flags/country/1x1/sn.svg';
import soFlag from '@assets/flags/country/1x1/so.svg';
import srFlag from '@assets/flags/country/1x1/sr.svg';
import ssFlag from '@assets/flags/country/1x1/ss.svg';
import stFlag from '@assets/flags/country/1x1/st.svg';
import svFlag from '@assets/flags/country/1x1/sv.svg';
import sxFlag from '@assets/flags/country/1x1/sx.svg';
import syFlag from '@assets/flags/country/1x1/sy.svg';
import szFlag from '@assets/flags/country/1x1/sz.svg';
import tcFlag from '@assets/flags/country/1x1/tc.svg';
import tdFlag from '@assets/flags/country/1x1/td.svg';
import tfFlag from '@assets/flags/country/1x1/tf.svg';
import tgFlag from '@assets/flags/country/1x1/tg.svg';
import thFlag from '@assets/flags/country/1x1/th.svg';
import tjFlag from '@assets/flags/country/1x1/tj.svg';
import tkFlag from '@assets/flags/country/1x1/tk.svg';
import tlFlag from '@assets/flags/country/1x1/tl.svg';
import tmFlag from '@assets/flags/country/1x1/tm.svg';
import tnFlag from '@assets/flags/country/1x1/tn.svg';
import toFlag from '@assets/flags/country/1x1/to.svg';
import trFlag from '@assets/flags/country/1x1/tr.svg';
import ttFlag from '@assets/flags/country/1x1/tt.svg';
import tvFlag from '@assets/flags/country/1x1/tv.svg';
import twFlag from '@assets/flags/country/1x1/tw.svg';
import tzFlag from '@assets/flags/country/1x1/tz.svg';
import uaFlag from '@assets/flags/country/1x1/ua.svg';
import ugFlag from '@assets/flags/country/1x1/ug.svg';
import umFlag from '@assets/flags/country/1x1/um.svg';
import unFlag from '@assets/flags/country/1x1/un.svg';
import usFlag from '@assets/flags/country/1x1/us.svg';
import uyFlag from '@assets/flags/country/1x1/uy.svg';
import uzFlag from '@assets/flags/country/1x1/uz.svg';
import vaFlag from '@assets/flags/country/1x1/va.svg';
import vcFlag from '@assets/flags/country/1x1/vc.svg';
import veFlag from '@assets/flags/country/1x1/ve.svg';
import vgFlag from '@assets/flags/country/1x1/vg.svg';
import viFlag from '@assets/flags/country/1x1/vi.svg';
import vnFlag from '@assets/flags/country/1x1/vn.svg';
import vuFlag from '@assets/flags/country/1x1/vu.svg';
import wfFlag from '@assets/flags/country/1x1/wf.svg';
import wsFlag from '@assets/flags/country/1x1/ws.svg';
import xkFlag from '@assets/flags/country/1x1/xk.svg';
import xxFlag from '@assets/flags/country/1x1/xx.svg';
import yeFlag from '@assets/flags/country/1x1/ye.svg';
import ytFlag from '@assets/flags/country/1x1/yt.svg';
import zaFlag from '@assets/flags/country/1x1/za.svg';
import zmFlag from '@assets/flags/country/1x1/zm.svg';
import zwFlag from '@assets/flags/country/1x1/zw.svg';
// #endregion flag imports

// #region epl flags imports
import arsFlag from '@assets/flags/epl2324/arsenal.svg';
import avaFlag from '@assets/flags/epl2324/astonvilla.svg';
import bouFlag from '@assets/flags/epl2324/bournemouth.svg';
import breFlag from '@assets/flags/epl2324/brentford.svg';
import brhFlag from '@assets/flags/epl2324/brighton.svg';
import burFlag from '@assets/flags/epl2324/burnley.svg';
import cheFlag from '@assets/flags/epl2324/chelsea.svg';
import cryFlag from '@assets/flags/epl2324/crystalpalace.svg';
import eveFlag from '@assets/flags/epl2324/everton.svg';
import fulFlag from '@assets/flags/epl2324/fulham.svg';
import livFlag from '@assets/flags/epl2324/liverpool.svg';
import lutFlag from '@assets/flags/epl2324/lutontown.svg';
import mciFlag from '@assets/flags/epl2324/manchestercity.svg';
import munFlag from '@assets/flags/epl2324/manchesterunited.svg';
import newFlag from '@assets/flags/epl2324/newcastle.svg';
import ntgFlag from '@assets/flags/epl2324/nottingham.svg';
import shuFlag from '@assets/flags/epl2324/sheffield.svg';
import totFlag from '@assets/flags/epl2324/tottenham.svg';
import whuFlag from '@assets/flags/epl2324/westham.svg';
import wlvFlag from '@assets/flags/epl2324/wolves.svg';
import leiFlag from '@assets/flags/epl2324/leicestercity.svg';
import ipsFlag from '@assets/flags/epl2324/ipswich.svg';
import souFlag from '@assets/flags/epl2324/southampton.svg';
// #endregion epl flags imports

// #region etc flags imports
import rmdFlag from '@assets/flags/etc/realmadrid.svg';
import bvbFlag from '@assets/flags/etc/dortmund.svg';
// #endregion etc flags imports

// #region euro2024 flags imports
import a_gerFlag from '@assets/flags/euro2024/a_ger.svg';
import a_hunFlag from '@assets/flags/euro2024/a_hun.svg';
import a_scoFlag from '@assets/flags/euro2024/a_sco.svg';
import a_suiFlag from '@assets/flags/euro2024/a_sui.svg';
import b_espFlag from '@assets/flags/euro2024/b_esp.svg';
import b_croFlag from '@assets/flags/euro2024/b_cro.svg';
import b_itaFlag from '@assets/flags/euro2024/b_ita.svg';
import b_albFlag from '@assets/flags/euro2024/b_alb.svg';
import c_svnFlag from '@assets/flags/euro2024/c_svn.svg';
import c_denFlag from '@assets/flags/euro2024/c_den.svg';
import c_srbFlag from '@assets/flags/euro2024/c_srb.svg';
import c_engFlag from '@assets/flags/euro2024/c_eng.svg';
import d_polFlag from '@assets/flags/euro2024/d_pol.svg';
import d_nedFlag from '@assets/flags/euro2024/d_ned.svg';
import d_autFlag from '@assets/flags/euro2024/d_aut.svg';
import d_fraFlag from '@assets/flags/euro2024/d_fra.svg';
import e_belFlag from '@assets/flags/euro2024/e_bel.svg';
import e_svkFlag from '@assets/flags/euro2024/e_svk.svg';
import e_rouFlag from '@assets/flags/euro2024/e_rou.svg';
import e_ukrFlag from '@assets/flags/euro2024/e_ukr.svg';
import f_turFlag from '@assets/flags/euro2024/f_tur.svg';
import f_geoFlag from '@assets/flags/euro2024/f_geo.svg';
import f_porFlag from '@assets/flags/euro2024/f_por.svg';
import f_czeFlag from '@assets/flags/euro2024/f_cze.svg';
// #endregion euro2024 flags imports

import mhnFlag from '@assets/flags/etc/munchen.svg';

export const getFlagImageUrl: (team: Team) => string | '/no/match/image.svg' = (
  team: Team,
) => {
  if (team.category === 'nation') {
    switch (team.code) {
      case 'ad':
        return adFlag;
      case 'ae':
        return aeFlag;
      case 'af':
        return afFlag;
      case 'ag':
        return agFlag;
      case 'ai':
        return aiFlag;
      case 'al':
        return alFlag;
      case 'am':
        return amFlag;
      case 'ao':
        return aoFlag;
      case 'aq':
        return aqFlag;
      case 'ar':
        return arFlag;
      case 'arab':
        return arabFlag;
      case 'as':
        return asFlag;
      case 'at':
        return atFlag;
      case 'au':
        return auFlag;
      case 'aw':
        return awFlag;
      case 'ax':
        return axFlag;
      case 'az':
        return azFlag;
      case 'ba':
        return baFlag;
      case 'bb':
        return bbFlag;
      case 'bd':
        return bdFlag;
      case 'be':
        return beFlag;
      case 'bf':
        return bfFlag;
      case 'bg':
        return bgFlag;
      case 'bh':
        return bhFlag;
      case 'bi':
        return biFlag;
      case 'bj':
        return bjFlag;
      case 'bl':
        return blFlag;
      case 'bm':
        return bmFlag;
      case 'bn':
        return bnFlag;
      case 'bo':
        return boFlag;
      case 'bq':
        return bqFlag;
      case 'br':
        return brFlag;
      case 'bs':
        return bsFlag;
      case 'bt':
        return btFlag;
      case 'bv':
        return bvFlag;
      case 'bw':
        return bwFlag;
      case 'by':
        return byFlag;
      case 'bz':
        return bzFlag;
      case 'ca':
        return caFlag;
      case 'cc':
        return ccFlag;
      case 'cd':
        return cdFlag;
      case 'cefta':
        return ceftaFlag;
      case 'cf':
        return cfFlag;
      case 'cg':
        return cgFlag;
      case 'ch':
        return chFlag;
      case 'ci':
        return ciFlag;
      case 'ck':
        return ckFlag;
      case 'cl':
        return clFlag;
      case 'cm':
        return cmFlag;
      case 'cn':
        return cnFlag;
      case 'co':
        return coFlag;
      case 'cp':
        return cpFlag;
      case 'cr':
        return crFlag;
      case 'cu':
        return cuFlag;
      case 'cv':
        return cvFlag;
      case 'cw':
        return cwFlag;
      case 'cx':
        return cxFlag;
      case 'cy':
        return cyFlag;
      case 'cz':
        return czFlag;
      case 'de':
        return deFlag;
      case 'dg':
        return dgFlag;
      case 'dj':
        return djFlag;
      case 'dk':
        return dkFlag;
      case 'dm':
        return dmFlag;
      case 'do':
        return doFlag;
      case 'dz':
        return dzFlag;
      case 'eac':
        return eacFlag;
      case 'ec':
        return ecFlag;
      case 'ee':
        return eeFlag;
      case 'eg':
        return egFlag;
      case 'eh':
        return ehFlag;
      case 'er':
        return erFlag;
      case 'es':
        return esFlag;
      case 'esct':
        return esctFlag;
      case 'esga':
        return esgaFlag;
      case 'espv':
        return espvFlag;
      case 'et':
        return etFlag;
      case 'eu':
        return euFlag;
      case 'fi':
        return fiFlag;
      case 'fj':
        return fjFlag;
      case 'fk':
        return fkFlag;
      case 'fm':
        return fmFlag;
      case 'fo':
        return foFlag;
      case 'fr':
        return frFlag;
      case 'ga':
        return gaFlag;
      case 'gb':
        return gbFlag;
      case 'gbeng':
        return gbengFlag;
      case 'gbnir':
        return gbnirFlag;
      case 'gbsct':
        return gbsctFlag;
      case 'gbwls':
        return gbwlsFlag;
      case 'gd':
        return gdFlag;
      case 'ge':
        return geFlag;
      case 'gf':
        return gfFlag;
      case 'gg':
        return ggFlag;
      case 'gh':
        return ghFlag;
      case 'gi':
        return giFlag;
      case 'gl':
        return glFlag;
      case 'gm':
        return gmFlag;
      case 'gn':
        return gnFlag;
      case 'gp':
        return gpFlag;
      case 'gq':
        return gqFlag;
      case 'gr':
        return grFlag;
      case 'gs':
        return gsFlag;
      case 'gt':
        return gtFlag;
      case 'gu':
        return guFlag;
      case 'gw':
        return gwFlag;
      case 'gy':
        return gyFlag;
      case 'hk':
        return hkFlag;
      case 'hm':
        return hmFlag;
      case 'hn':
        return hnFlag;
      case 'hr':
        return hrFlag;
      case 'ht':
        return htFlag;
      case 'hu':
        return huFlag;
      case 'ic':
        return icFlag;
      case 'id':
        return idFlag;
      case 'ie':
        return ieFlag;
      case 'il':
        return ilFlag;
      case 'im':
        return imFlag;
      case 'in':
        return inFlag;
      case 'io':
        return ioFlag;
      case 'iq':
        return iqFlag;
      case 'ir':
        return irFlag;
      case 'is':
        return isFlag;
      case 'it':
        return itFlag;
      case 'je':
        return jeFlag;
      case 'jm':
        return jmFlag;
      case 'jo':
        return joFlag;
      case 'jp':
        return jpFlag;
      case 'ke':
        return keFlag;
      case 'kg':
        return kgFlag;
      case 'kh':
        return khFlag;
      case 'ki':
        return kiFlag;
      case 'km':
        return kmFlag;
      case 'kn':
        return knFlag;
      case 'kp':
        return kpFlag;
      case 'kr':
        return krFlag;
      case 'kw':
        return kwFlag;
      case 'ky':
        return kyFlag;
      case 'kz':
        return kzFlag;
      case 'la':
        return laFlag;
      case 'lb':
        return lbFlag;
      case 'lc':
        return lcFlag;
      case 'li':
        return liFlag;
      case 'lk':
        return lkFlag;
      case 'lr':
        return lrFlag;
      case 'ls':
        return lsFlag;
      case 'lt':
        return ltFlag;
      case 'lu':
        return luFlag;
      case 'lv':
        return lvFlag;
      case 'ly':
        return lyFlag;
      case 'ma':
        return maFlag;
      case 'mc':
        return mcFlag;
      case 'md':
        return mdFlag;
      case 'me':
        return meFlag;
      case 'mf':
        return mfFlag;
      case 'mg':
        return mgFlag;
      case 'mh':
        return mhFlag;
      case 'mk':
        return mkFlag;
      case 'ml':
        return mlFlag;
      case 'mm':
        return mmFlag;
      case 'mn':
        return mnFlag;
      case 'mo':
        return moFlag;
      case 'mp':
        return mpFlag;
      case 'mq':
        return mqFlag;
      case 'mr':
        return mrFlag;
      case 'ms':
        return msFlag;
      case 'mt':
        return mtFlag;
      case 'mu':
        return muFlag;
      case 'mv':
        return mvFlag;
      case 'mw':
        return mwFlag;
      case 'mx':
        return mxFlag;
      case 'my':
        return myFlag;
      case 'mz':
        return mzFlag;
      case 'na':
        return naFlag;
      case 'nc':
        return ncFlag;
      case 'ne':
        return neFlag;
      case 'nf':
        return nfFlag;
      case 'ng':
        return ngFlag;
      case 'ni':
        return niFlag;
      case 'nl':
        return nlFlag;
      case 'no':
        return noFlag;
      case 'np':
        return npFlag;
      case 'nr':
        return nrFlag;
      case 'nu':
        return nuFlag;
      case 'nz':
        return nzFlag;
      case 'om':
        return omFlag;
      case 'pa':
        return paFlag;
      case 'pc':
        return pcFlag;
      case 'pe':
        return peFlag;
      case 'pf':
        return pfFlag;
      case 'pg':
        return pgFlag;
      case 'ph':
        return phFlag;
      case 'pk':
        return pkFlag;
      case 'pl':
        return plFlag;
      case 'pm':
        return pmFlag;
      case 'pn':
        return pnFlag;
      case 'pr':
        return prFlag;
      case 'ps':
        return psFlag;
      case 'pt':
        return ptFlag;
      case 'pw':
        return pwFlag;
      case 'py':
        return pyFlag;
      case 'qa':
        return qaFlag;
      case 're':
        return reFlag;
      case 'ro':
        return roFlag;
      case 'rs':
        return rsFlag;
      case 'ru':
        return ruFlag;
      case 'rw':
        return rwFlag;
      case 'sa':
        return saFlag;
      case 'sb':
        return sbFlag;
      case 'sc':
        return scFlag;
      case 'sd':
        return sdFlag;
      case 'se':
        return seFlag;
      case 'sg':
        return sgFlag;
      case 'sh':
        return shFlag;
      case 'shac':
        return shacFlag;
      case 'shhl':
        return shhlFlag;
      case 'shta':
        return shtaFlag;
      case 'si':
        return siFlag;
      case 'sj':
        return sjFlag;
      case 'sk':
        return skFlag;
      case 'sl':
        return slFlag;
      case 'sm':
        return smFlag;
      case 'sn':
        return snFlag;
      case 'so':
        return soFlag;
      case 'sr':
        return srFlag;
      case 'ss':
        return ssFlag;
      case 'st':
        return stFlag;
      case 'sv':
        return svFlag;
      case 'sx':
        return sxFlag;
      case 'sy':
        return syFlag;
      case 'sz':
        return szFlag;
      case 'tc':
        return tcFlag;
      case 'td':
        return tdFlag;
      case 'tf':
        return tfFlag;
      case 'tg':
        return tgFlag;
      case 'th':
        return thFlag;
      case 'tj':
        return tjFlag;
      case 'tk':
        return tkFlag;
      case 'tl':
        return tlFlag;
      case 'tm':
        return tmFlag;
      case 'tn':
        return tnFlag;
      case 'to':
        return toFlag;
      case 'tr':
        return trFlag;
      case 'tt':
        return ttFlag;
      case 'tv':
        return tvFlag;
      case 'tw':
        return twFlag;
      case 'tz':
        return tzFlag;
      case 'ua':
        return uaFlag;
      case 'ug':
        return ugFlag;
      case 'um':
        return umFlag;
      case 'un':
        return unFlag;
      case 'us':
        return usFlag;
      case 'uy':
        return uyFlag;
      case 'uz':
        return uzFlag;
      case 'va':
        return vaFlag;
      case 'vc':
        return vcFlag;
      case 've':
        return veFlag;
      case 'vg':
        return vgFlag;
      case 'vi':
        return viFlag;
      case 'vn':
        return vnFlag;
      case 'vu':
        return vuFlag;
      case 'wf':
        return wfFlag;
      case 'ws':
        return wsFlag;
      case 'xk':
        return xkFlag;
      case 'xx':
        return xxFlag;
      case 'ye':
        return yeFlag;
      case 'yt':
        return ytFlag;
      case 'za':
        return zaFlag;
      case 'zm':
        return zmFlag;
      case 'zw':
        return zwFlag;
      default:
    }
  } else if (team.category === 'epl2324') {
    switch (team.code) {
      case 'ars':
        return arsFlag; // 아스날
      case 'ava':
        return avaFlag; // 아스톤빌라
      case 'bou':
        return bouFlag; // 본머스
      case 'bre':
        return breFlag; // 브래트포드
      case 'brh':
        return brhFlag; // 브라이튼
      case 'bur':
        return burFlag; // 번리
      case 'che':
        return cheFlag; // 첼시
      case 'cry':
        return cryFlag; // 크리스탈 펠리스
      case 'eve':
        return eveFlag; // 에버튼
      case 'ful':
        return fulFlag; // 풀햄
      case 'liv':
        return livFlag; // 리버풀
      case 'lut':
        return lutFlag; // 루턴타운
      case 'mci':
        return mciFlag; // 맨시티
      case 'mun':
        return munFlag; // 맨유
      case 'nwc':
        return newFlag; // 뉴캐슬
      case 'ntg':
        return ntgFlag; // 노팅엄
      case 'shu':
        return shuFlag; // 셰필드
      case 'tot':
        return totFlag; // 토트넘
      case 'whu':
        return whuFlag; // 웨스트햄유나이티드
      case 'wlv':
        return wlvFlag; // 울브스
      case 'lei':
        return leiFlag; // 레스터
      case 'ips':
        return ipsFlag; // 이프스위치
      case 'sou':
        return souFlag; // 사우샘프턴
      default:
        break;
    }
  } else if (team.category === 'euro2024') {
    switch (team.code) {
      case 'ger':
        return a_gerFlag; // 독일
      case 'sco':
        return a_scoFlag; // 스코틀랜드
      case 'hun':
        return a_hunFlag; // 헝가리
      case 'sui':
        return a_suiFlag; // 스위스
      case 'esp':
        return b_espFlag; // 스페인
      case 'cro':
        return b_croFlag; // 크로아티아
      case 'ita':
        return b_itaFlag; // 이탈리아
      case 'alb':
        return b_albFlag; // 알바니아
      case 'svn':
        return c_svnFlag; // 슬로베니아
      case 'den':
        return c_denFlag; // 덴마크
      case 'srb':
        return c_srbFlag; // 세르비아
      case 'eng':
        return c_engFlag; // 잉글랜드
      case 'pol':
        return d_polFlag; // 폴란드
      case 'ned':
        return d_nedFlag; // 네덜란드
      case 'aut':
        return d_autFlag; // 오스트리아
      case 'fra':
        return d_fraFlag; // 프랑스
      case 'bel':
        return e_belFlag; // 벨기에
      case 'svk':
        return e_svkFlag; // 슬로바키아
      case 'rou':
        return e_rouFlag; // 루마니아
      case 'ukr':
        return e_ukrFlag; // 우크라이나
      case 'tur':
        return f_turFlag; // 터키
      case 'geo':
        return f_geoFlag; // 조지아
      case 'por':
        return f_porFlag; // 포르투갈
      case 'cze':
        return f_czeFlag; // 체코
    }
  } else if (team.category === 'etc') {
    switch (team.code) {
      case 'rmd':
        return rmdFlag; // 레알 마드리드
      case 'bvb':
        return bvbFlag; // 도르트문트
      case 'ety':
        return mhnFlag; // 뮌헨
    }
  }
  return '/no/match/image.svg'; // 일치하는 국가 코드가 없는 경우
};
