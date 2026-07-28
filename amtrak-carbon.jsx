import { useMemo, useState } from "react";

/* ============================================================
   DATA — stations & routes
   Mileposts are estimates derived from Amtrak timetables.
   ============================================================ */

const STATIONS = {
  BOS: { name: "Boston, MA (South Station)", lat: 42.35, lon: -71.06, ap: "BOS" },
  BBY: { name: "Boston, MA (Back Bay)", lat: 42.35, lon: -71.08, ap: "BOS" },
  RTE: { name: "Route 128, MA (Westwood)", lat: 42.21, lon: -71.15, ap: "BOS" },
  PVD: { name: "Providence, RI", lat: 41.82, lon: -71.41, ap: "PVD" },
  KIN: { name: "Kingston, RI", lat: 41.48, lon: -71.56, ap: "PVD" },
  WLY: { name: "Westerly, RI", lat: 41.38, lon: -71.83, ap: "PVD" },
  MYS: { name: "Mystic, CT", lat: 41.35, lon: -71.97, ap: "HVN" },
  NLC: { name: "New London, CT", lat: 41.35, lon: -72.09, ap: "HVN" },
  OSB: { name: "Old Saybrook, CT", lat: 41.3, lon: -72.38, ap: "HVN" },
  NHV: { name: "New Haven, CT", lat: 41.3, lon: -72.93, ap: "HVN" },
  BRP: { name: "Bridgeport, CT", lat: 41.18, lon: -73.19, ap: "HVN" },
  STM: { name: "Stamford, CT", lat: 41.05, lon: -73.54, ap: "HPN" },
  NRO: { name: "New Rochelle, NY", lat: 40.91, lon: -73.78, ap: "LGA" },
  NYP: { name: "New York, NY (Penn Station)", lat: 40.75, lon: -73.99, ap: "LGA" },
  NWK: { name: "Newark, NJ (Penn Station)", lat: 40.73, lon: -74.16, ap: "EWR" },
  EWR: { name: "Newark Airport, NJ", lat: 40.7, lon: -74.19, ap: "EWR" },
  MET: { name: "Metropark, NJ (Iselin)", lat: 40.57, lon: -74.33, ap: "EWR" },
  NBK: { name: "New Brunswick, NJ", lat: 40.5, lon: -74.45, ap: "EWR" },
  PJC: { name: "Princeton Junction, NJ", lat: 40.32, lon: -74.62, ap: "TTN" },
  TRE: { name: "Trenton, NJ", lat: 40.22, lon: -74.75, ap: "TTN" },
  CWH: { name: "Cornwells Heights, PA", lat: 40.07, lon: -74.95, ap: "PHL" },
  PHL: { name: "Philadelphia, PA (30th St)", lat: 39.95, lon: -75.18, ap: "PHL" },
  WIL: { name: "Wilmington, DE", lat: 39.74, lon: -75.55, ap: "PHL" },
  NRK: { name: "Newark, DE", lat: 39.67, lon: -75.75, ap: "PHL" },
  ABE: { name: "Aberdeen, MD", lat: 39.51, lon: -76.16, ap: "BWI" },
  BAL: { name: "Baltimore, MD (Penn Station)", lat: 39.31, lon: -76.62, ap: "BWI" },
  BWI: { name: "BWI Airport, MD", lat: 39.19, lon: -76.69, ap: "BWI" },
  NCR: { name: "New Carrollton, MD", lat: 38.95, lon: -76.87, ap: "DCA" },
  WAS: { name: "Washington, DC (Union Station)", lat: 38.9, lon: -77.01, ap: "DCA" },
  LNC: { name: "Lancaster, PA", lat: 40.04, lon: -76.31, ap: "LNS" },
  HAR: { name: "Harrisburg, PA", lat: 40.26, lon: -76.88, ap: "MDT" },
  YNY: { name: "Yonkers, NY", lat: 40.94, lon: -73.9, ap: "LGA" },
  POU: { name: "Poughkeepsie, NY", lat: 41.71, lon: -73.94, ap: "SWF" },
  ALB: { name: "Albany–Rensselaer, NY", lat: 42.64, lon: -73.74, ap: "ALB" },
  UCA: { name: "Utica, NY", lat: 43.1, lon: -75.22, ap: "SYR" },
  SYR: { name: "Syracuse, NY", lat: 43.08, lon: -76.17, ap: "SYR" },
  ROC: { name: "Rochester, NY", lat: 43.16, lon: -77.61, ap: "ROC" },
  BUF: { name: "Buffalo–Depew, NY", lat: 42.9, lon: -78.7, ap: "BUF" },
  NFL: { name: "Niagara Falls, NY", lat: 43.09, lon: -79.06, ap: "IAG" },
  ERI: { name: "Erie, PA", lat: 42.12, lon: -80.08, ap: "ERI" },
  CLE: { name: "Cleveland, OH", lat: 41.5, lon: -81.7, ap: "CLE" },
  TOL: { name: "Toledo, OH", lat: 41.65, lon: -83.54, ap: "TOL" },
  CHI: { name: "Chicago, IL (Union Station)", lat: 41.88, lon: -87.64, ap: "ORD" },
  HFY: { name: "Harpers Ferry, WV", lat: 39.32, lon: -77.74, ap: "IAD" },
  CUM: { name: "Cumberland, MD", lat: 39.65, lon: -78.76, ap: "HGR" },
  PGH: { name: "Pittsburgh, PA", lat: 40.44, lon: -80.0, ap: "PIT" },
  ALT: { name: "Altoona, PA", lat: 40.51, lon: -78.4, ap: "AOO" },
  JST: { name: "Johnstown, PA", lat: 40.33, lon: -78.92, ap: "JST" },
  CVS: { name: "Charlottesville, VA", lat: 38.03, lon: -78.48, ap: "CHO" },
  GRO: { name: "Greensboro, NC", lat: 36.07, lon: -79.79, ap: "GSO" },
  CLT: { name: "Charlotte, NC", lat: 35.23, lon: -80.84, ap: "CLT" },
  ATL: { name: "Atlanta, GA", lat: 33.75, lon: -84.39, ap: "ATL" },
  BHM: { name: "Birmingham, AL", lat: 33.52, lon: -86.81, ap: "BHM" },
  NOL: { name: "New Orleans, LA", lat: 29.95, lon: -90.08, ap: "MSY" },
  RVR: { name: "Richmond, VA", lat: 37.55, lon: -77.46, ap: "RIC" },
  CHS: { name: "Charleston, SC", lat: 32.88, lon: -80.03, ap: "CHS" },
  SAV: { name: "Savannah, GA", lat: 32.08, lon: -81.1, ap: "SAV" },
  JAX: { name: "Jacksonville, FL", lat: 30.33, lon: -81.66, ap: "JAX" },
  ORL: { name: "Orlando, FL", lat: 28.54, lon: -81.38, ap: "MCO" },
  MIA: { name: "Miami, FL", lat: 25.77, lon: -80.19, ap: "MIA" },
  OMA: { name: "Omaha, NE", lat: 41.25, lon: -95.93, ap: "OMA" },
  DEN: { name: "Denver, CO (Union Station)", lat: 39.75, lon: -105.0, ap: "DEN" },
  GSC: { name: "Glenwood Springs, CO", lat: 39.55, lon: -107.32, ap: "EGE" },
  SLC: { name: "Salt Lake City, UT", lat: 40.76, lon: -111.89, ap: "SLC" },
  RNO: { name: "Reno, NV", lat: 39.53, lon: -119.81, ap: "RNO" },
  SAC: { name: "Sacramento, CA", lat: 38.58, lon: -121.49, ap: "SMF" },
  EMY: { name: "Emeryville, CA (SF Bay)", lat: 37.84, lon: -122.29, ap: "OAK" },
  KCY: { name: "Kansas City, MO", lat: 39.08, lon: -94.59, ap: "MCI" },
  ABQ: { name: "Albuquerque, NM", lat: 35.08, lon: -106.65, ap: "ABQ" },
  FLG: { name: "Flagstaff, AZ", lat: 35.2, lon: -111.65, ap: "FLG" },
  LAX: { name: "Los Angeles, CA (Union Station)", lat: 34.06, lon: -118.24, ap: "LAX" },
  MKE: { name: "Milwaukee, WI", lat: 43.03, lon: -87.91, ap: "MKE" },
  MSP: { name: "St. Paul, MN (Union Depot)", lat: 44.95, lon: -93.09, ap: "MSP" },
  FAR: { name: "Fargo, ND", lat: 46.88, lon: -96.79, ap: "FAR" },
  MOT: { name: "Minot, ND", lat: 48.23, lon: -101.29, ap: "MOT" },
  SBY: { name: "Shelby, MT", lat: 48.51, lon: -111.86, ap: "GTF" },
  CUT: { name: "Cut Bank, MT", lat: 48.63, lon: -112.33, ap: "GTF" },
  BRO: { name: "Browning, MT", lat: 48.56, lon: -113.01, ap: "FCA" },
  GPK: { name: "East Glacier Park, MT", lat: 48.44, lon: -113.22, ap: "FCA" },
  ESM: { name: "Essex, MT (Izaak Walton)", lat: 48.28, lon: -113.61, ap: "FCA" },
  WGL: { name: "West Glacier, MT (Belton)", lat: 48.5, lon: -113.98, ap: "FCA" },
  WFH: { name: "Whitefish, MT", lat: 48.41, lon: -114.34, ap: "FCA" },
  LIB: { name: "Libby, MT", lat: 48.39, lon: -115.55, ap: "FCA" },
  SPK: { name: "Spokane, WA", lat: 47.66, lon: -117.42, ap: "GEG" },
  SEA: { name: "Seattle, WA (King Street)", lat: 47.6, lon: -122.33, ap: "SEA" },
  TAC: { name: "Tacoma, WA", lat: 47.24, lon: -122.42, ap: "SEA" },
  OLW: { name: "Olympia–Lacey, WA", lat: 46.99, lon: -122.79, ap: "SEA" },
  CTL: { name: "Centralia, WA", lat: 46.72, lon: -122.95, ap: "SEA" },
  KEL: { name: "Kelso–Longview, WA", lat: 46.14, lon: -122.91, ap: "PDX" },
  VAN: { name: "Vancouver, WA", lat: 45.63, lon: -122.68, ap: "PDX" },
  PDX: { name: "Portland, OR (Union Station)", lat: 45.53, lon: -122.68, ap: "PDX" },
  SLM: { name: "Salem, OR", lat: 44.94, lon: -123.03, ap: "SLE" },
  ALY: { name: "Albany, OR", lat: 44.63, lon: -123.1, ap: "EUG" },
  EUG: { name: "Eugene, OR", lat: 44.05, lon: -123.09, ap: "EUG" },
  CMO: { name: "Chemult, OR", lat: 43.22, lon: -121.78, ap: "LMT" },
  KFS: { name: "Klamath Falls, OR", lat: 42.22, lon: -121.79, ap: "LMT" },
  DUN: { name: "Dunsmuir, CA", lat: 41.21, lon: -122.27, ap: "RDD" },
  RDD: { name: "Redding, CA", lat: 40.58, lon: -122.39, ap: "RDD" },
  CIC: { name: "Chico, CA", lat: 39.73, lon: -121.84, ap: "SMF" },
  DAV: { name: "Davis, CA", lat: 38.54, lon: -121.74, ap: "SMF" },
  MTZ: { name: "Martinez, CA", lat: 38.02, lon: -122.14, ap: "OAK" },
  OKJ: { name: "Oakland, CA (Jack London Sq)", lat: 37.79, lon: -122.28, ap: "OAK" },
  SJC: { name: "San Jose, CA", lat: 37.33, lon: -121.9, ap: "SJC" },
  SNS: { name: "Salinas, CA", lat: 36.68, lon: -121.66, ap: "MRY" },
  PRB: { name: "Paso Robles, CA", lat: 35.62, lon: -120.69, ap: "SBP" },
  SLO: { name: "San Luis Obispo, CA", lat: 35.28, lon: -120.66, ap: "SBP" },
  SBA: { name: "Santa Barbara, CA", lat: 34.42, lon: -119.69, ap: "SBA" },
  OXN: { name: "Oxnard, CA", lat: 34.2, lon: -119.18, ap: "SBA" },
  VNC: { name: "Van Nuys, CA", lat: 34.19, lon: -118.45, ap: "BUR" },
  SAN: { name: "San Diego, CA", lat: 32.72, lon: -117.17, ap: "SAN" },
  SPI: { name: "Springfield, IL", lat: 39.8, lon: -89.65, ap: "SPI" },
  STL: { name: "St. Louis, MO (Gateway)", lat: 38.63, lon: -90.2, ap: "STL" },
  LRK: { name: "Little Rock, AR", lat: 34.75, lon: -92.29, ap: "LIT" },
  DAL: { name: "Dallas, TX", lat: 32.78, lon: -96.81, ap: "DAL" },
  FTW: { name: "Fort Worth, TX", lat: 32.75, lon: -97.33, ap: "DFW" },
  AUS: { name: "Austin, TX", lat: 30.27, lon: -97.74, ap: "AUS" },
  SAS: { name: "San Antonio, TX", lat: 29.43, lon: -98.49, ap: "SAT" },
  MEM: { name: "Memphis, TN", lat: 35.15, lon: -90.05, ap: "MEM" },
  JAN: { name: "Jackson, MS", lat: 32.3, lon: -90.19, ap: "JAN" },
  HOS: { name: "Houston, TX", lat: 29.77, lon: -95.37, ap: "HOU" },
  ELP: { name: "El Paso, TX", lat: 31.76, lon: -106.49, ap: "ELP" },
  TUS: { name: "Tucson, AZ", lat: 32.22, lon: -110.97, ap: "TUS" },
  ARB: { name: "Ann Arbor, MI", lat: 42.28, lon: -83.75, ap: "DTW" },
  DET: { name: "Detroit, MI", lat: 42.33, lon: -83.05, ap: "DTW" },
  OKC: { name: "Oklahoma City, OK", lat: 35.47, lon: -97.52, ap: "OKC" },
  ARD: { name: "Ardmore, PA", lat: 40.01, lon: -75.29, ap: "PHL" },
  PAO: { name: "Paoli, PA", lat: 40.04, lon: -75.48, ap: "PHL" },
  EXT: { name: "Exton, PA", lat: 40.02, lon: -75.62, ap: "PHL" },
  DWT: { name: "Downingtown, PA", lat: 40, lon: -75.71, ap: "PHL" },
  COV: { name: "Coatesville, PA", lat: 39.98, lon: -75.82, ap: "LNS" },
  PAR: { name: "Parkesburg, PA", lat: 39.96, lon: -75.92, ap: "LNS" },
  MTJ: { name: "Mount Joy, PA", lat: 40.11, lon: -76.51, ap: "MDT" },
  ETN: { name: "Elizabethtown, PA", lat: 40.15, lon: -76.6, ap: "MDT" },
  MDN: { name: "Middletown, PA", lat: 40.2, lon: -76.73, ap: "MDT" },
  CRT: { name: "Croton–Harmon, NY", lat: 41.19, lon: -73.88, ap: "HPN" },
  RHI: { name: "Rhinecliff, NY", lat: 41.92, lon: -73.95, ap: "SWF" },
  HUD: { name: "Hudson, NY", lat: 42.25, lon: -73.8, ap: "ALB" },
  SDY: { name: "Schenectady, NY", lat: 42.81, lon: -73.94, ap: "ALB" },
  AMS: { name: "Amsterdam, NY", lat: 42.94, lon: -74.19, ap: "ALB" },
  ROM: { name: "Rome, NY", lat: 43.22, lon: -75.46, ap: "SYR" },
  BFX: { name: "Buffalo (Exchange St), NY", lat: 42.88, lon: -78.88, ap: "BUF" },
  FRA: { name: "Framingham, MA", lat: 42.28, lon: -71.42, ap: "BOS" },
  WOR: { name: "Worcester, MA", lat: 42.26, lon: -71.79, ap: "ORH" },
  SPG: { name: "Springfield, MA", lat: 42.11, lon: -72.59, ap: "BDL" },
  PTF: { name: "Pittsfield, MA", lat: 42.45, lon: -73.25, ap: "ALB" },
  ELY: { name: "Elyria, OH", lat: 41.37, lon: -82.1, ap: "CLE" },
  SKY: { name: "Sandusky, OH", lat: 41.45, lon: -82.71, ap: "CLE" },
  BRY: { name: "Bryan, OH", lat: 41.47, lon: -84.55, ap: "TOL" },
  WTL: { name: "Waterloo, IN", lat: 41.43, lon: -85.02, ap: "FWA" },
  EKH: { name: "Elkhart, IN", lat: 41.68, lon: -85.97, ap: "SBN" },
  SOB: { name: "South Bend, IN", lat: 41.7, lon: -86.31, ap: "SBN" },
  RKV: { name: "Rockville, MD", lat: 39.08, lon: -77.15, ap: "DCA" },
  MRT: { name: "Martinsburg, WV", lat: 39.46, lon: -77.97, ap: "HGR" },
  CNV: { name: "Connellsville, PA", lat: 40.02, lon: -79.59, ap: "PIT" },
  ALC: { name: "Alliance, OH", lat: 40.92, lon: -81.11, ap: "CAK" },
  LEW: { name: "Lewistown, PA", lat: 40.6, lon: -77.57, ap: "SCE" },
  HUN: { name: "Huntingdon, PA", lat: 40.48, lon: -78.01, ap: "SCE" },
  TYR: { name: "Tyrone, PA", lat: 40.67, lon: -78.24, ap: "AOO" },
  LTB: { name: "Latrobe, PA", lat: 40.32, lon: -79.38, ap: "LBE" },
  GBG: { name: "Greensburg, PA", lat: 40.3, lon: -79.54, ap: "LBE" },
  AXD: { name: "Alexandria, VA", lat: 38.81, lon: -77.06, ap: "DCA" },
  MSS: { name: "Manassas, VA", lat: 38.75, lon: -77.47, ap: "IAD" },
  CLP: { name: "Culpeper, VA", lat: 38.47, lon: -78, ap: "CHO" },
  LYN: { name: "Lynchburg, VA", lat: 37.41, lon: -79.14, ap: "LYH" },
  DAN: { name: "Danville, VA", lat: 36.58, lon: -79.4, ap: "GSO" },
  HPT: { name: "High Point, NC", lat: 35.97, lon: -80, ap: "GSO" },
  SLB: { name: "Salisbury, NC", lat: 35.67, lon: -80.47, ap: "CLT" },
  GAS: { name: "Gastonia, NC", lat: 35.26, lon: -81.18, ap: "CLT" },
  SPB: { name: "Spartanburg, SC", lat: 34.95, lon: -81.93, ap: "GSP" },
  GRV: { name: "Greenville, SC", lat: 34.85, lon: -82.4, ap: "GSP" },
  CSN: { name: "Clemson, SC", lat: 34.68, lon: -82.84, ap: "GSP" },
  TCA: { name: "Toccoa, GA", lat: 34.58, lon: -83.33, ap: "GSP" },
  GNS: { name: "Gainesville, GA", lat: 34.3, lon: -83.82, ap: "ATL" },
  ANN: { name: "Anniston, AL", lat: 33.66, lon: -85.83, ap: "BHM" },
  TCL: { name: "Tuscaloosa, AL", lat: 33.21, lon: -87.57, ap: "BHM" },
  MER: { name: "Meridian, MS", lat: 32.36, lon: -88.7, ap: "MEI" },
  LAU: { name: "Laurel, MS", lat: 31.69, lon: -89.13, ap: "PIB" },
  HBG: { name: "Hattiesburg, MS", lat: 31.32, lon: -89.29, ap: "PIB" },
  PIC: { name: "Picayune, MS", lat: 30.53, lon: -89.68, ap: "MSY" },
  SDL: { name: "Slidell, LA", lat: 30.28, lon: -89.78, ap: "MSY" },
  PTB: { name: "Petersburg, VA", lat: 37.2, lon: -77.39, ap: "RIC" },
  RMT: { name: "Rocky Mount, NC", lat: 35.94, lon: -77.79, ap: "RDU" },
  FTV: { name: "Fayetteville, NC", lat: 35.05, lon: -78.88, ap: "FAY" },
  FLN: { name: "Florence, SC", lat: 34.19, lon: -79.76, ap: "FLO" },
  KTR: { name: "Kingstree, SC", lat: 33.66, lon: -79.83, ap: "CHS" },
  YEM: { name: "Yemassee, SC", lat: 32.69, lon: -80.85, ap: "SAV" },
  JSP: { name: "Jesup, GA", lat: 31.6, lon: -81.89, ap: "SAV" },
  PLK: { name: "Palatka, FL", lat: 29.65, lon: -81.66, ap: "JAX" },
  DLD: { name: "DeLand, FL", lat: 29.03, lon: -81.3, ap: "DAB" },
  WPK: { name: "Winter Park, FL", lat: 28.6, lon: -81.35, ap: "MCO" },
  KIS: { name: "Kissimmee, FL", lat: 28.29, lon: -81.42, ap: "MCO" },
  WTH: { name: "Winter Haven, FL", lat: 28.02, lon: -81.72, ap: "MCO" },
  SEB: { name: "Sebring, FL", lat: 27.5, lon: -81.44, ap: "PGD" },
  WPB: { name: "West Palm Beach, FL", lat: 26.71, lon: -80.05, ap: "PBI" },
  DLB: { name: "Delray Beach, FL", lat: 26.46, lon: -80.07, ap: "PBI" },
  DFB: { name: "Deerfield Beach, FL", lat: 26.32, lon: -80.09, ap: "FLL" },
  FTL: { name: "Fort Lauderdale, FL", lat: 26.12, lon: -80.14, ap: "FLL" },
  HOL: { name: "Hollywood, FL", lat: 26.01, lon: -80.17, ap: "FLL" },
  NPV: { name: "Naperville, IL", lat: 41.78, lon: -88.15, ap: "ORD" },
  PCT: { name: "Princeton, IL", lat: 41.37, lon: -89.46, ap: "PIA" },
  GAL: { name: "Galesburg, IL", lat: 40.95, lon: -90.37, ap: "MLI" },
  BRL: { name: "Burlington, IA", lat: 40.81, lon: -91.1, ap: "MLI" },
  MTP: { name: "Mount Pleasant, IA", lat: 40.97, lon: -91.55, ap: "MLI" },
  OTM: { name: "Ottumwa, IA", lat: 41.01, lon: -92.41, ap: "DSM" },
  OSC: { name: "Osceola, IA", lat: 41.03, lon: -93.77, ap: "DSM" },
  CRN: { name: "Creston, IA", lat: 41.06, lon: -94.36, ap: "DSM" },
  LCN: { name: "Lincoln, NE", lat: 40.81, lon: -96.71, ap: "LNK" },
  HAS: { name: "Hastings, NE", lat: 40.59, lon: -98.39, ap: "GRI" },
  HLD: { name: "Holdrege, NE", lat: 40.44, lon: -99.37, ap: "GRI" },
  MCC: { name: "McCook, NE", lat: 40.2, lon: -100.63, ap: "MCK" },
  FMG: { name: "Fort Morgan, CO", lat: 40.25, lon: -103.8, ap: "DEN" },
  WPR: { name: "Fraser–Winter Park, CO", lat: 39.94, lon: -105.79, ap: "DEN" },
  GBY: { name: "Granby, CO", lat: 40.09, lon: -105.94, ap: "DEN" },
  GJC: { name: "Grand Junction, CO", lat: 39.06, lon: -108.57, ap: "GJT" },
  GRR: { name: "Green River, UT", lat: 38.99, lon: -110.16, ap: "CNY" },
  HLP: { name: "Helper, UT", lat: 39.68, lon: -110.85, ap: "PVU" },
  PRV: { name: "Provo, UT", lat: 40.23, lon: -111.66, ap: "PVU" },
  ELK: { name: "Elko, NV", lat: 40.83, lon: -115.79, ap: "EKO" },
  WNN: { name: "Winnemucca, NV", lat: 40.98, lon: -117.74, ap: "WMC" },
  TRU: { name: "Truckee, CA", lat: 39.33, lon: -120.19, ap: "RNO" },
  CFX: { name: "Colfax, CA", lat: 39.1, lon: -120.95, ap: "SMF" },
  RSV: { name: "Roseville, CA", lat: 38.75, lon: -121.29, ap: "SMF" },
  RCH: { name: "Richmond, CA", lat: 37.94, lon: -122.35, ap: "OAK" },
  MDO: { name: "Mendota, IL", lat: 41.55, lon: -89.12, ap: "MLI" },
  FMD: { name: "Fort Madison, IA", lat: 40.63, lon: -91.32, ap: "MLI" },
  LPL: { name: "La Plata, MO", lat: 40.03, lon: -92.49, ap: "IRK" },
  LWR: { name: "Lawrence, KS", lat: 38.97, lon: -95.24, ap: "MCI" },
  TOP: { name: "Topeka, KS", lat: 39.05, lon: -95.68, ap: "MCI" },
  NEW: { name: "Newton, KS", lat: 38.05, lon: -97.35, ap: "ICT" },
  HUT: { name: "Hutchinson, KS", lat: 38.06, lon: -97.93, ap: "ICT" },
  DDG: { name: "Dodge City, KS", lat: 37.76, lon: -100.02, ap: "DDC" },
  GDC: { name: "Garden City, KS", lat: 37.97, lon: -100.86, ap: "GCK" },
  LMR: { name: "Lamar, CO", lat: 38.09, lon: -102.62, ap: "GCK" },
  LJT: { name: "La Junta, CO", lat: 37.99, lon: -103.55, ap: "COS" },
  TRI: { name: "Trinidad, CO", lat: 37.17, lon: -104.51, ap: "COS" },
  RAT: { name: "Raton, NM", lat: 36.9, lon: -104.44, ap: "SAF" },
  LVN: { name: "Las Vegas, NM", lat: 35.59, lon: -105.22, ap: "SAF" },
  LMY: { name: "Lamy, NM", lat: 35.48, lon: -105.88, ap: "SAF" },
  GLP: { name: "Gallup, NM", lat: 35.53, lon: -108.74, ap: "ABQ" },
  WLO: { name: "Winslow, AZ", lat: 35.02, lon: -110.7, ap: "FLG" },
  KNG: { name: "Kingman, AZ", lat: 35.19, lon: -114.05, ap: "LAS" },
  NDL: { name: "Needles, CA", lat: 34.84, lon: -114.61, ap: "LAS" },
  BAR: { name: "Barstow, CA", lat: 34.9, lon: -117.02, ap: "ONT" },
  VIC: { name: "Victorville, CA", lat: 34.55, lon: -117.32, ap: "ONT" },
  SNB: { name: "San Bernardino, CA", lat: 34.1, lon: -117.31, ap: "ONT" },
  RIV: { name: "Riverside, CA", lat: 33.97, lon: -117.38, ap: "ONT" },
  FUL: { name: "Fullerton, CA", lat: 33.87, lon: -117.92, ap: "SNA" },
  GLN: { name: "Glenview, IL", lat: 42.08, lon: -87.81, ap: "ORD" },
  CBS: { name: "Columbus, WI", lat: 43.34, lon: -89.01, ap: "MSN" },
  PTG: { name: "Portage, WI", lat: 43.55, lon: -89.47, ap: "MSN" },
  WDL: { name: "Wisconsin Dells, WI", lat: 43.63, lon: -89.77, ap: "MSN" },
  TOH: { name: "Tomah, WI", lat: 43.98, lon: -90.5, ap: "LSE" },
  LAC: { name: "La Crosse, WI", lat: 43.81, lon: -91.25, ap: "LSE" },
  WIN: { name: "Winona, MN", lat: 44.05, lon: -91.64, ap: "LSE" },
  RDW: { name: "Red Wing, MN", lat: 44.57, lon: -92.54, ap: "MSP" },
  SCD: { name: "St. Cloud, MN", lat: 45.56, lon: -94.15, ap: "MSP" },
  STP: { name: "Staples, MN", lat: 46.36, lon: -94.79, ap: "BRD" },
  DLK: { name: "Detroit Lakes, MN", lat: 46.82, lon: -95.85, ap: "FAR" },
  GFS: { name: "Grand Forks, ND", lat: 47.93, lon: -97.03, ap: "GFK" },
  DVK: { name: "Devils Lake, ND", lat: 48.11, lon: -98.86, ap: "DVL" },
  RUG: { name: "Rugby, ND", lat: 48.37, lon: -100, ap: "MOT" },
  STN: { name: "Stanley, ND", lat: 48.32, lon: -102.39, ap: "MOT" },
  WLN: { name: "Williston, ND", lat: 48.15, lon: -103.62, ap: "ISN" },
  WPT: { name: "Wolf Point, MT", lat: 48.09, lon: -105.64, ap: "OLF" },
  GLA: { name: "Glasgow, MT", lat: 48.2, lon: -106.64, ap: "GGW" },
  MLT: { name: "Malta, MT", lat: 48.36, lon: -107.87, ap: "GGW" },
  HAV: { name: "Havre, MT", lat: 48.55, lon: -109.68, ap: "HVR" },
  SPT: { name: "Sandpoint, ID", lat: 48.28, lon: -116.55, ap: "GEG" },
  EPH: { name: "Ephrata, WA", lat: 47.32, lon: -119.55, ap: "MWH" },
  WEN: { name: "Wenatchee, WA", lat: 47.42, lon: -120.31, ap: "EAT" },
  EVR: { name: "Everett, WA", lat: 47.98, lon: -122.2, ap: "PAE" },
  EDM: { name: "Edmonds, WA", lat: 47.81, lon: -122.38, ap: "PAE" },
  PSO: { name: "Pasco, WA", lat: 46.23, lon: -119.09, ap: "PSC" },
  WSH: { name: "Wishram, WA", lat: 45.66, lon: -120.97, ap: "PDX" },
  BGN: { name: "Bingen–White Salmon, WA", lat: 45.71, lon: -121.47, ap: "PDX" },
  BUA: { name: "Burbank Airport, CA", lat: 34.2, lon: -118.35, ap: "BUR" },
  GVB: { name: "Grover Beach, CA", lat: 35.12, lon: -120.62, ap: "SBP" },
  GDL: { name: "Guadalupe, CA", lat: 34.96, lon: -120.57, ap: "SMX" },
  LPS: { name: "Lompoc–Surf, CA", lat: 34.68, lon: -120.6, ap: "SMX" },
  GOL: { name: "Goleta, CA", lat: 34.44, lon: -119.82, ap: "SBA" },
  CPT: { name: "Carpinteria, CA", lat: 34.4, lon: -119.52, ap: "SBA" },
  VEN: { name: "Ventura, CA", lat: 34.28, lon: -119.3, ap: "SBA" },
  CAM: { name: "Camarillo, CA", lat: 34.22, lon: -119.03, ap: "BUR" },
  MPK: { name: "Moorpark, CA", lat: 34.28, lon: -118.88, ap: "BUR" },
  SIM: { name: "Simi Valley, CA", lat: 34.27, lon: -118.7, ap: "BUR" },
  CHW: { name: "Chatsworth, CA", lat: 34.26, lon: -118.6, ap: "BUR" },
  GDA: { name: "Glendale, CA", lat: 34.12, lon: -118.26, ap: "BUR" },
  ANA: { name: "Anaheim, CA", lat: 33.82, lon: -117.92, ap: "SNA" },
  STA: { name: "Santa Ana, CA", lat: 33.75, lon: -117.87, ap: "SNA" },
  IRV: { name: "Irvine, CA", lat: 33.66, lon: -117.74, ap: "SNA" },
  SJP: { name: "San Juan Capistrano, CA", lat: 33.5, lon: -117.66, ap: "SNA" },
  SCL: { name: "San Clemente, CA", lat: 33.43, lon: -117.62, ap: "SNA" },
  OCE: { name: "Oceanside, CA", lat: 33.19, lon: -117.38, ap: "SAN" },
  SOL: { name: "Solana Beach, CA", lat: 32.99, lon: -117.27, ap: "SAN" },
  OTS: { name: "San Diego (Old Town), CA", lat: 32.75, lon: -117.2, ap: "SAN" },
  JOL: { name: "Joliet, IL", lat: 41.52, lon: -88.08, ap: "ORD" },
  PON: { name: "Pontiac, IL", lat: 40.88, lon: -88.63, ap: "BMI" },
  BLM: { name: "Bloomington–Normal, IL", lat: 40.49, lon: -88.99, ap: "BMI" },
  LIL: { name: "Lincoln, IL", lat: 40.15, lon: -89.36, ap: "SPI" },
  CRV: { name: "Carlinville, IL", lat: 39.28, lon: -89.88, ap: "SPI" },
  ALN: { name: "Alton, IL", lat: 38.9, lon: -90.18, ap: "STL" },
  ARC: { name: "Arcadia Valley, MO", lat: 37.59, lon: -90.63, ap: "STL" },
  PPB: { name: "Poplar Bluff, MO", lat: 36.76, lon: -90.4, ap: "CGI" },
  WRD: { name: "Walnut Ridge, AR", lat: 36.07, lon: -90.94, ap: "JBR" },
  MLV: { name: "Malvern, AR", lat: 34.36, lon: -92.81, ap: "LIT" },
  AKD: { name: "Arkadelphia, AR", lat: 34.12, lon: -93.05, ap: "LIT" },
  HOP: { name: "Hope, AR", lat: 33.66, lon: -93.59, ap: "TXK" },
  TXR: { name: "Texarkana, AR", lat: 33.42, lon: -94.04, ap: "TXK" },
  MSH: { name: "Marshall, TX", lat: 32.55, lon: -94.37, ap: "GGG" },
  LGV: { name: "Longview, TX", lat: 32.49, lon: -94.74, ap: "GGG" },
  MIN: { name: "Mineola, TX", lat: 32.66, lon: -95.49, ap: "TYR" },
  CLB: { name: "Cleburne, TX", lat: 32.35, lon: -97.38, ap: "DFW" },
  MCG: { name: "McGregor, TX", lat: 31.44, lon: -97.41, ap: "ACT" },
  TEM: { name: "Temple, TX", lat: 31.1, lon: -97.35, ap: "GRK" },
  TAY: { name: "Taylor, TX", lat: 30.57, lon: -97.41, ap: "AUS" },
  SMC: { name: "San Marcos, TX", lat: 29.88, lon: -97.94, ap: "SAT" },
  HMW: { name: "Homewood, IL", lat: 41.56, lon: -87.66, ap: "ORD" },
  KKE: { name: "Kankakee, IL", lat: 41.12, lon: -87.87, ap: "ORD" },
  CHM: { name: "Champaign–Urbana, IL", lat: 40.12, lon: -88.24, ap: "CMI" },
  MTN: { name: "Mattoon, IL", lat: 39.48, lon: -88.38, ap: "CMI" },
  EFF: { name: "Effingham, IL", lat: 39.12, lon: -88.55, ap: "CMI" },
  CIL: { name: "Centralia, IL", lat: 38.53, lon: -89.13, ap: "STL" },
  CBD: { name: "Carbondale, IL", lat: 37.73, lon: -89.22, ap: "MWA" },
  FLT: { name: "Fulton, KY", lat: 36.5, lon: -88.87, ap: "PAH" },
  NWB: { name: "Newbern–Dyersburg, TN", lat: 36.11, lon: -89.26, ap: "MEM" },
  MKS: { name: "Marks, MS", lat: 34.26, lon: -90.27, ap: "MEM" },
  GWD: { name: "Greenwood, MS", lat: 33.52, lon: -90.18, ap: "JAN" },
  YAZ: { name: "Yazoo City, MS", lat: 32.86, lon: -90.41, ap: "JAN" },
  HAZ: { name: "Hazlehurst, MS", lat: 31.87, lon: -90.4, ap: "JAN" },
  BKH: { name: "Brookhaven, MS", lat: 31.58, lon: -90.44, ap: "JAN" },
  MCB: { name: "McComb, MS", lat: 31.24, lon: -90.45, ap: "JAN" },
  HMD: { name: "Hammond, LA", lat: 30.5, lon: -90.46, ap: "MSY" },
  SCH: { name: "Schriever, LA", lat: 29.74, lon: -90.81, ap: "MSY" },
  NIB: { name: "New Iberia, LA", lat: 30, lon: -91.82, ap: "LFT" },
  LFY: { name: "Lafayette, LA", lat: 30.22, lon: -92.02, ap: "LFT" },
  LKC: { name: "Lake Charles, LA", lat: 30.22, lon: -93.22, ap: "LCH" },
  BMT: { name: "Beaumont, TX", lat: 30.08, lon: -94.1, ap: "HOU" },
  DRO: { name: "Del Rio, TX", lat: 29.36, lon: -100.9, ap: "DRT" },
  SND: { name: "Sanderson, TX", lat: 30.14, lon: -102.4, ap: "DRT" },
  ALP: { name: "Alpine, TX", lat: 30.36, lon: -103.66, ap: "ELP" },
  DEM: { name: "Deming, NM", lat: 32.26, lon: -107.76, ap: "ELP" },
  LDB: { name: "Lordsburg, NM", lat: 32.35, lon: -108.71, ap: "ELP" },
  BEN: { name: "Benson, AZ", lat: 31.97, lon: -110.29, ap: "TUS" },
  MAR: { name: "Maricopa, AZ", lat: 33.06, lon: -112.05, ap: "PHX" },
  YMA: { name: "Yuma, AZ", lat: 32.69, lon: -114.62, ap: "YUM" },
  PSG: { name: "Palm Springs, CA", lat: 33.85, lon: -116.51, ap: "PSP" },
  ONA: { name: "Ontario, CA", lat: 34.06, lon: -117.65, ap: "ONT" },
  POM: { name: "Pomona, CA", lat: 34.06, lon: -117.75, ap: "ONT" },
  NBF: { name: "New Buffalo, MI", lat: 41.79, lon: -86.74, ap: "SBN" },
  NIL: { name: "Niles, MI", lat: 41.83, lon: -86.25, ap: "SBN" },
  DWG: { name: "Dowagiac, MI", lat: 41.98, lon: -86.11, ap: "SBN" },
  KZO: { name: "Kalamazoo, MI", lat: 42.29, lon: -85.58, ap: "AZO" },
  BTC: { name: "Battle Creek, MI", lat: 42.32, lon: -85.18, ap: "AZO" },
  ABN: { name: "Albion, MI", lat: 42.24, lon: -84.75, ap: "AZO" },
  JXN: { name: "Jackson, MI", lat: 42.25, lon: -84.4, ap: "LAN" },
  DRB: { name: "Dearborn, MI", lat: 42.31, lon: -83.23, ap: "DTW" },
  RYO: { name: "Royal Oak, MI", lat: 42.49, lon: -83.14, ap: "DTW" },
  TRY: { name: "Troy, MI", lat: 42.55, lon: -83.16, ap: "DTW" },
  PTC: { name: "Pontiac, MI", lat: 42.64, lon: -83.29, ap: "DTW" },
  GTX: { name: "Gainesville, TX", lat: 33.63, lon: -97.14, ap: "DFW" },
  ADM: { name: "Ardmore, OK", lat: 34.17, lon: -97.14, ap: "OKC" },
  PVY: { name: "Pauls Valley, OK", lat: 34.74, lon: -97.22, ap: "OKC" },
  PUR: { name: "Purcell, OK", lat: 35.01, lon: -97.36, ap: "OKC" },
  NRM: { name: "Norman, OK", lat: 35.22, lon: -97.44, ap: "OKC" },
  STU: { name: "Staunton, VA", lat: 38.15, lon: -79.07, ap: "SHD" },
  CFG: { name: "Clifton Forge, VA", lat: 37.82, lon: -79.82, ap: "ROA" },
  WSS: { name: "White Sulphur Springs, WV", lat: 37.8, lon: -80.3, ap: "LWB" },
  ALS: { name: "Alderson, WV", lat: 37.73, lon: -80.64, ap: "LWB" },
  HIN: { name: "Hinton, WV", lat: 37.67, lon: -80.89, ap: "LWB" },
  PRC: { name: "Prince, WV", lat: 37.85, lon: -81.06, ap: "BKW" },
  CWV: { name: "Charleston, WV", lat: 38.35, lon: -81.63, ap: "CRW" },
  HTG: { name: "Huntington, WV", lat: 38.42, lon: -82.44, ap: "HTS" },
  AKY: { name: "Ashland, KY", lat: 38.48, lon: -82.64, ap: "HTS" },
  MYV: { name: "Maysville, KY", lat: 38.64, lon: -83.76, ap: "CVG" },
  CIN: { name: "Cincinnati, OH", lat: 39.11, lon: -84.5, ap: "CVG" },
  CNS: { name: "Connersville, IN", lat: 39.64, lon: -85.14, ap: "IND" },
  IPS: { name: "Indianapolis, IN", lat: 39.76, lon: -86.16, ap: "IND" },
  CWF: { name: "Crawfordsville, IN", lat: 40.04, lon: -86.9, ap: "IND" },
  LFI: { name: "Lafayette, IN", lat: 40.42, lon: -86.89, ap: "IND" },
  REN: { name: "Rensselaer, IN", lat: 40.94, lon: -87.15, ap: "ORD" },
  DYE: { name: "Dyer, IN", lat: 41.5, lon: -87.52, ap: "ORD" },
  SEL: { name: "Selma–Smithfield, NC", lat: 35.54, lon: -78.28, ap: "RDU" },
  RAL: { name: "Raleigh, NC", lat: 35.78, lon: -78.64, ap: "RDU" },
  CRY: { name: "Cary, NC", lat: 35.79, lon: -78.78, ap: "RDU" },
  SPN: { name: "Southern Pines, NC", lat: 35.17, lon: -79.39, ap: "FAY" },
  HML: { name: "Hamlet, NC", lat: 34.88, lon: -79.7, ap: "FLO" },
  CMD: { name: "Camden, SC", lat: 34.27, lon: -80.61, ap: "CAE" },
  CLA: { name: "Columbia, SC", lat: 34, lon: -81.05, ap: "CAE" },
  DNK: { name: "Denmark, SC", lat: 33.32, lon: -81.14, ap: "SAV" },
  LKL: { name: "Lakeland, FL", lat: 28.05, lon: -81.96, ap: "TPA" },
  TAM: { name: "Tampa, FL", lat: 27.95, lon: -82.45, ap: "TPA" },
  LOR: { name: "Lorton, VA (Auto Train)", lat: 38.71, lon: -77.21, ap: "IAD" },
  SFD: { name: "Sanford, FL (Auto Train)", lat: 28.81, lon: -81.27, ap: "SFB" },
  MRD: { name: "Meriden, CT", lat: 41.54, lon: -72.8, ap: "BDL" },
  HFD: { name: "Hartford, CT", lat: 41.77, lon: -72.68, ap: "BDL" },
  WLC: { name: "Windsor Locks, CT", lat: 41.93, lon: -72.63, ap: "BDL" },
  HOK: { name: "Holyoke, MA", lat: 42.2, lon: -72.61, ap: "BDL" },
  NHP: { name: "Northampton, MA", lat: 42.32, lon: -72.63, ap: "BDL" },
  GFD: { name: "Greenfield, MA", lat: 42.59, lon: -72.6, ap: "BDL" },
  BRT: { name: "Brattleboro, VT", lat: 42.85, lon: -72.56, ap: "BDL" },
  BLF: { name: "Bellows Falls, VT", lat: 43.13, lon: -72.44, ap: "LEB" },
  CLM: { name: "Claremont, NH", lat: 43.37, lon: -72.35, ap: "LEB" },
  WRJ: { name: "White River Junction, VT", lat: 43.65, lon: -72.32, ap: "LEB" },
  RDP: { name: "Randolph, VT", lat: 43.92, lon: -72.66, ap: "BTV" },
  MPL: { name: "Montpelier, VT", lat: 44.25, lon: -72.6, ap: "BTV" },
  WBY: { name: "Waterbury, VT", lat: 44.33, lon: -72.75, ap: "BTV" },
  EJC: { name: "Essex Junction (Burlington), VT", lat: 44.49, lon: -73.11, ap: "BTV" },
  SAB: { name: "St. Albans, VT", lat: 44.81, lon: -73.08, ap: "BTV" },
  SSP: { name: "Saratoga Springs, NY", lat: 43.07, lon: -73.79, ap: "ALB" },
  FED: { name: "Fort Edward, NY", lat: 43.27, lon: -73.59, ap: "ALB" },
  WHL: { name: "Whitehall, NY", lat: 43.56, lon: -73.4, ap: "BTV" },
  CAS: { name: "Castleton, VT", lat: 43.61, lon: -73.18, ap: "RUT" },
  RTL: { name: "Rutland, VT", lat: 43.61, lon: -72.97, ap: "RUT" },
  MDB: { name: "Middlebury, VT", lat: 44.02, lon: -73.17, ap: "BTV" },
  VRG: { name: "Vergennes, VT", lat: 44.17, lon: -73.25, ap: "BTV" },
  BRG: { name: "Burlington, VT", lat: 44.48, lon: -73.22, ap: "BTV" },
  TIC: { name: "Ticonderoga, NY", lat: 43.85, lon: -73.42, ap: "BTV" },
  WSP: { name: "Westport, NY", lat: 44.19, lon: -73.44, ap: "BTV" },
  PKT: { name: "Port Kent, NY", lat: 44.53, lon: -73.41, ap: "PBG" },
  PLB: { name: "Plattsburgh, NY", lat: 44.7, lon: -73.45, ap: "PBG" },
  RSP: { name: "Rouses Point, NY", lat: 44.99, lon: -73.37, ap: "PBG" },
  SLU: { name: "Saint-Lambert, QC", lat: 45.5, lon: -73.51, ap: "YUL" },
  MTL: { name: "Montréal, QC (Gare Centrale)", lat: 45.5, lon: -73.57, ap: "YUL" },
  DRM: { name: "Durham, NC", lat: 35.99, lon: -78.91, ap: "RDU" },
  BNC: { name: "Burlington, NC", lat: 36.1, lon: -79.44, ap: "GSO" },
  KAN: { name: "Kannapolis, NC", lat: 35.5, lon: -80.62, ap: "CLT" },
  NFK: { name: "Norfolk, VA", lat: 36.85, lon: -76.29, ap: "ORF" },
  WMB: { name: "Williamsburg, VA", lat: 37.27, lon: -76.71, ap: "PHF" },
  NPN: { name: "Newport News, VA", lat: 36.98, lon: -76.43, ap: "PHF" },
  RNK: { name: "Roanoke, VA", lat: 37.27, lon: -79.94, ap: "ROA" },
  SJM: { name: "St. Joseph, MI", lat: 42.11, lon: -86.48, ap: "SBN" },
  BGR: { name: "Bangor, MI", lat: 42.31, lon: -86.11, ap: "AZO" },
  HLM: { name: "Holland, MI", lat: 42.79, lon: -86.11, ap: "GRR" },
  GRP: { name: "Grand Rapids, MI", lat: 42.97, lon: -85.67, ap: "GRR" },
  ELN: { name: "East Lansing, MI", lat: 42.73, lon: -84.49, ap: "LAN" },
  DUR: { name: "Durand, MI", lat: 42.91, lon: -83.98, ap: "FNT" },
  FLI: { name: "Flint, MI", lat: 43.02, lon: -83.69, ap: "FNT" },
  LAP: { name: "Lapeer, MI", lat: 43.05, lon: -83.32, ap: "FNT" },
  PHU: { name: "Port Huron, MI", lat: 42.97, lon: -82.42, ap: "FNT" },
  KWD: { name: "Kirkwood, MO", lat: 38.58, lon: -90.41, ap: "STL" },
  WMO: { name: "Washington, MO", lat: 38.56, lon: -91.01, ap: "STL" },
  HRM: { name: "Hermann, MO", lat: 38.7, lon: -91.44, ap: "COU" },
  JEF: { name: "Jefferson City, MO", lat: 38.58, lon: -92.17, ap: "COU" },
  SED: { name: "Sedalia, MO", lat: 38.7, lon: -93.23, ap: "COU" },
  WAR: { name: "Warrensburg, MO", lat: 38.76, lon: -93.74, ap: "MCI" },
  LSU: { name: "Lee's Summit, MO", lat: 38.92, lon: -94.38, ap: "MCI" },
  IDP: { name: "Independence, MO", lat: 39.09, lon: -94.42, ap: "MCI" },
  PLN: { name: "Plano, IL", lat: 41.66, lon: -88.54, ap: "ORD" },
  KEW: { name: "Kewanee, IL", lat: 41.24, lon: -89.92, ap: "MLI" },
  MAC: { name: "Macomb, IL", lat: 40.46, lon: -90.67, ap: "PIA" },
  QCY: { name: "Quincy, IL", lat: 39.94, lon: -91.41, ap: "UIN" },
  BSL: { name: "Bay St. Louis, MS", lat: 30.31, lon: -89.33, ap: "GPT" },
  GLF: { name: "Gulfport, MS", lat: 30.37, lon: -89.09, ap: "GPT" },
  BIL: { name: "Biloxi, MS", lat: 30.39, lon: -88.89, ap: "GPT" },
  PAS: { name: "Pascagoula, MS", lat: 30.37, lon: -88.56, ap: "MOB" },
  MBL: { name: "Mobile, AL", lat: 30.69, lon: -88.04, ap: "MOB" },
  ANT: { name: "Antioch, CA", lat: 38.02, lon: -121.82, ap: "OAK" },
  STK: { name: "Stockton, CA", lat: 37.96, lon: -121.29, ap: "SCK" },
  MOD: { name: "Modesto, CA", lat: 37.64, lon: -121, ap: "SCK" },
  TUR: { name: "Turlock–Denair, CA", lat: 37.49, lon: -120.85, ap: "SCK" },
  MCD: { name: "Merced, CA", lat: 37.3, lon: -120.48, ap: "FAT" },
  MAD: { name: "Madera, CA", lat: 36.96, lon: -120.06, ap: "FAT" },
  FRE: { name: "Fresno, CA", lat: 36.74, lon: -119.79, ap: "FAT" },
  HAN: { name: "Hanford, CA", lat: 36.33, lon: -119.65, ap: "FAT" },
  COR: { name: "Corcoran, CA", lat: 36.1, lon: -119.56, ap: "BFL" },
  WSO: { name: "Wasco, CA", lat: 35.59, lon: -119.34, ap: "BFL" },
  BKF: { name: "Bakersfield, CA", lat: 35.37, lon: -119.02, ap: "BFL" },
  SCC: { name: "Santa Clara, CA", lat: 37.35, lon: -121.94, ap: "SJC" },
  FRM: { name: "Fremont, CA", lat: 37.56, lon: -121.98, ap: "OAK" },
  HAY: { name: "Hayward, CA", lat: 37.67, lon: -122.09, ap: "OAK" },
  BRK: { name: "Berkeley, CA", lat: 37.87, lon: -122.3, ap: "OAK" },
  SUI: { name: "Suisun–Fairfield, CA", lat: 38.24, lon: -122.04, ap: "SMF" },
  RCK: { name: "Rocklin, CA", lat: 38.79, lon: -121.24, ap: "SMF" },
  AUB: { name: "Auburn, CA", lat: 38.9, lon: -121.08, ap: "SMF" },
  BON: { name: "Boston, MA (North Station)", lat: 42.37, lon: -71.06, ap: "BOS" },
  WOB: { name: "Woburn, MA", lat: 42.5, lon: -71.14, ap: "BOS" },
  HVL: { name: "Haverhill, MA", lat: 42.77, lon: -71.09, ap: "MHT" },
  EXE: { name: "Exeter, NH", lat: 42.97, lon: -70.96, ap: "MHT" },
  DNH: { name: "Durham–UNH, NH", lat: 43.14, lon: -70.93, ap: "MHT" },
  DOV: { name: "Dover, NH", lat: 43.2, lon: -70.88, ap: "MHT" },
  SCO: { name: "Saco–Biddeford, ME", lat: 43.5, lon: -70.44, ap: "PWM" },
  OOB: { name: "Old Orchard Beach, ME", lat: 43.52, lon: -70.38, ap: "PWM" },
  PME: { name: "Portland, ME", lat: 43.66, lon: -70.26, ap: "PWM" },
  FRP: { name: "Freeport, ME", lat: 43.86, lon: -70.1, ap: "PWM" },
  BRW: { name: "Brunswick, ME", lat: 43.92, lon: -69.97, ap: "PWM" },
  STW: { name: "Stanwood, WA", lat: 48.24, lon: -122.34, ap: "PAE" },
  MVW: { name: "Mount Vernon, WA", lat: 48.42, lon: -122.33, ap: "BLI" },
  BEL: { name: "Bellingham, WA", lat: 48.75, lon: -122.51, ap: "BLI" },
  VBC: { name: "Vancouver, BC (Pacific Central)", lat: 49.27, lon: -123.1, ap: "YVR" },
  NFO: { name: "Niagara Falls, ON", lat: 43.1, lon: -79.07, ap: "BUF" },
  SCA: { name: "St. Catharines, ON", lat: 43.15, lon: -79.26, ap: "BUF" },
  ALD: { name: "Aldershot, ON", lat: 43.31, lon: -79.86, ap: "YHM" },
  OKV: { name: "Oakville, ON", lat: 43.45, lon: -79.68, ap: "YYZ" },
  TOR: { name: "Toronto, ON (Union Station)", lat: 43.65, lon: -79.38, ap: "YYZ" },
};

// Nearest commercial airports. rgn: small regional field — connections usually required.
const AIRPORTS = {
  BOS: { name: "Boston Logan", lat: 42.36, lon: -71.01 },
  PVD: { name: "Providence T.F. Green", lat: 41.73, lon: -71.43 },
  HVN: { name: "New Haven Tweed", lat: 41.26, lon: -72.89, rgn: true },
  HPN: { name: "Westchester County", lat: 41.07, lon: -73.71, rgn: true },
  LGA: { name: "New York LaGuardia", lat: 40.78, lon: -73.87 },
  EWR: { name: "Newark Liberty", lat: 40.69, lon: -74.17 },
  TTN: { name: "Trenton–Mercer", lat: 40.28, lon: -74.81, rgn: true },
  PHL: { name: "Philadelphia Intl", lat: 39.87, lon: -75.24 },
  BWI: { name: "Baltimore–Washington Intl", lat: 39.18, lon: -76.67 },
  DCA: { name: "Washington Reagan", lat: 38.85, lon: -77.04 },
  IAD: { name: "Washington Dulles", lat: 38.95, lon: -77.46 },
  LNS: { name: "Lancaster", lat: 40.12, lon: -76.29, rgn: true },
  MDT: { name: "Harrisburg Intl", lat: 40.19, lon: -76.76 },
  SWF: { name: "New York Stewart", lat: 41.5, lon: -74.1, rgn: true },
  ALB: { name: "Albany Intl", lat: 42.75, lon: -73.8 },
  SYR: { name: "Syracuse Hancock", lat: 43.11, lon: -76.11 },
  ROC: { name: "Rochester Intl", lat: 43.12, lon: -77.67 },
  BUF: { name: "Buffalo Niagara", lat: 42.94, lon: -78.73 },
  IAG: { name: "Niagara Falls Intl", lat: 43.11, lon: -78.95, rgn: true },
  ERI: { name: "Erie Intl", lat: 42.08, lon: -80.17, rgn: true },
  CLE: { name: "Cleveland Hopkins", lat: 41.41, lon: -81.85 },
  TOL: { name: "Toledo Express", lat: 41.59, lon: -83.81, rgn: true },
  ORD: { name: "Chicago O'Hare", lat: 41.98, lon: -87.9 },
  HGR: { name: "Hagerstown", lat: 39.71, lon: -77.73, rgn: true },
  PIT: { name: "Pittsburgh Intl", lat: 40.49, lon: -80.23 },
  AOO: { name: "Altoona–Blair County", lat: 40.3, lon: -78.32, rgn: true },
  JST: { name: "Johnstown–Cambria", lat: 40.32, lon: -78.83, rgn: true },
  CHO: { name: "Charlottesville–Albemarle", lat: 38.14, lon: -78.45 },
  GSO: { name: "Greensboro Piedmont Triad", lat: 36.1, lon: -79.94 },
  CLT: { name: "Charlotte Douglas", lat: 35.21, lon: -80.94 },
  ATL: { name: "Atlanta Hartsfield–Jackson", lat: 33.64, lon: -84.43 },
  BHM: { name: "Birmingham–Shuttlesworth", lat: 33.56, lon: -86.75 },
  MSY: { name: "New Orleans Armstrong", lat: 29.99, lon: -90.26 },
  RIC: { name: "Richmond Intl", lat: 37.51, lon: -77.32 },
  CHS: { name: "Charleston Intl", lat: 32.9, lon: -80.04 },
  SAV: { name: "Savannah/Hilton Head", lat: 32.13, lon: -81.2 },
  JAX: { name: "Jacksonville Intl", lat: 30.49, lon: -81.69 },
  MCO: { name: "Orlando Intl", lat: 28.43, lon: -81.31 },
  MIA: { name: "Miami Intl", lat: 25.8, lon: -80.29 },
  OMA: { name: "Omaha Eppley", lat: 41.3, lon: -95.89 },
  DEN: { name: "Denver Intl", lat: 39.86, lon: -104.67 },
  EGE: { name: "Eagle County (Vail)", lat: 39.64, lon: -106.92, rgn: true },
  SLC: { name: "Salt Lake City Intl", lat: 40.79, lon: -111.98 },
  RNO: { name: "Reno–Tahoe", lat: 39.5, lon: -119.77 },
  SMF: { name: "Sacramento Intl", lat: 38.7, lon: -121.59 },
  OAK: { name: "Oakland Intl", lat: 37.72, lon: -122.22 },
  MCI: { name: "Kansas City Intl", lat: 39.3, lon: -94.71 },
  ABQ: { name: "Albuquerque Sunport", lat: 35.04, lon: -106.61 },
  FLG: { name: "Flagstaff Pulliam", lat: 35.14, lon: -111.67, rgn: true },
  LAX: { name: "Los Angeles Intl", lat: 33.94, lon: -118.41 },
  MKE: { name: "Milwaukee Mitchell", lat: 42.95, lon: -87.9 },
  MSP: { name: "Minneapolis–St. Paul", lat: 44.88, lon: -93.22 },
  FAR: { name: "Fargo Hector", lat: 46.92, lon: -96.82 },
  MOT: { name: "Minot Intl", lat: 48.26, lon: -101.28, rgn: true },
  GTF: { name: "Great Falls Intl", lat: 47.48, lon: -111.37, rgn: true },
  FCA: { name: "Glacier Park Intl (Kalispell)", lat: 48.31, lon: -114.26, rgn: true },
  GEG: { name: "Spokane Intl", lat: 47.62, lon: -117.53 },
  SEA: { name: "Seattle–Tacoma Intl", lat: 47.45, lon: -122.31 },
  PDX: { name: "Portland Intl", lat: 45.59, lon: -122.6 },
  SLE: { name: "Salem Willamette Valley", lat: 44.91, lon: -123.0, rgn: true },
  EUG: { name: "Eugene Mahlon Sweet", lat: 44.12, lon: -123.21 },
  LMT: { name: "Klamath Falls Crater Lake", lat: 42.16, lon: -121.73, rgn: true },
  RDD: { name: "Redding Regional", lat: 40.51, lon: -122.29, rgn: true },
  SJC: { name: "San Jose Mineta", lat: 37.36, lon: -121.93 },
  MRY: { name: "Monterey Regional", lat: 36.59, lon: -121.84, rgn: true },
  SBP: { name: "San Luis Obispo Regional", lat: 35.24, lon: -120.64, rgn: true },
  SBA: { name: "Santa Barbara Muni", lat: 34.43, lon: -119.84 },
  BUR: { name: "Hollywood Burbank", lat: 34.2, lon: -118.36 },
  SAN: { name: "San Diego Intl", lat: 32.73, lon: -117.19 },
  SPI: { name: "Springfield Abraham Lincoln", lat: 39.84, lon: -89.68, rgn: true },
  STL: { name: "St. Louis Lambert", lat: 38.75, lon: -90.37 },
  LIT: { name: "Little Rock Clinton", lat: 34.73, lon: -92.22 },
  DAL: { name: "Dallas Love Field", lat: 32.85, lon: -96.85 },
  DFW: { name: "Dallas–Fort Worth Intl", lat: 32.9, lon: -97.04 },
  AUS: { name: "Austin–Bergstrom", lat: 30.19, lon: -97.67 },
  SAT: { name: "San Antonio Intl", lat: 29.53, lon: -98.47 },
  MEM: { name: "Memphis Intl", lat: 35.04, lon: -89.98 },
  JAN: { name: "Jackson–Medgar Evers", lat: 32.31, lon: -90.08 },
  HOU: { name: "Houston Hobby", lat: 29.65, lon: -95.28 },
  ELP: { name: "El Paso Intl", lat: 31.81, lon: -106.38 },
  TUS: { name: "Tucson Intl", lat: 32.12, lon: -110.94 },
  DTW: { name: "Detroit Metro", lat: 42.21, lon: -83.35 },
  OKC: { name: "Oklahoma City Will Rogers", lat: 35.39, lon: -97.6 },
  BDL: { name: "Hartford Bradley", lat: 41.94, lon: -72.68 },
  ORH: { name: "Worcester Regional", lat: 42.27, lon: -71.88, rgn: true },
  SBN: { name: "South Bend Intl", lat: 41.71, lon: -86.32 },
  FWA: { name: "Fort Wayne Intl", lat: 41, lon: -85.19 },
  CAK: { name: "Akron–Canton", lat: 40.92, lon: -81.44 },
  SCE: { name: "State College", lat: 40.85, lon: -77.85, rgn: true },
  LBE: { name: "Arnold Palmer (Latrobe)", lat: 40.28, lon: -79.4, rgn: true },
  LYH: { name: "Lynchburg Regional", lat: 37.33, lon: -79.2, rgn: true },
  GSP: { name: "Greenville–Spartanburg", lat: 34.9, lon: -82.22 },
  MEI: { name: "Meridian Regional", lat: 32.33, lon: -88.75, rgn: true },
  PIB: { name: "Hattiesburg–Laurel", lat: 31.47, lon: -89.34, rgn: true },
  RDU: { name: "Raleigh–Durham", lat: 35.88, lon: -78.79 },
  FAY: { name: "Fayetteville Regional", lat: 34.99, lon: -78.88, rgn: true },
  FLO: { name: "Florence Regional", lat: 34.19, lon: -79.72, rgn: true },
  DAB: { name: "Daytona Beach Intl", lat: 29.18, lon: -81.06 },
  PGD: { name: "Punta Gorda", lat: 26.92, lon: -81.99, rgn: true },
  PBI: { name: "Palm Beach Intl", lat: 26.68, lon: -80.1 },
  FLL: { name: "Fort Lauderdale Intl", lat: 26.07, lon: -80.15 },
  MLI: { name: "Quad Cities Intl", lat: 41.45, lon: -90.51, rgn: true },
  PIA: { name: "Peoria Intl", lat: 40.66, lon: -89.69, rgn: true },
  DSM: { name: "Des Moines Intl", lat: 41.53, lon: -93.66 },
  LNK: { name: "Lincoln Airport", lat: 40.85, lon: -96.76, rgn: true },
  GRI: { name: "Grand Island", lat: 40.97, lon: -98.31, rgn: true },
  MCK: { name: "McCook Regional", lat: 40.21, lon: -100.59, rgn: true },
  GJT: { name: "Grand Junction Regional", lat: 39.12, lon: -108.53, rgn: true },
  CNY: { name: "Moab Canyonlands", lat: 38.75, lon: -109.75, rgn: true },
  PVU: { name: "Provo Airport", lat: 40.22, lon: -111.72, rgn: true },
  EKO: { name: "Elko Regional", lat: 40.82, lon: -115.79, rgn: true },
  WMC: { name: "Winnemucca Muni", lat: 40.9, lon: -117.81, rgn: true },
  ICT: { name: "Wichita Eisenhower", lat: 37.65, lon: -97.43 },
  DDC: { name: "Dodge City Regional", lat: 37.76, lon: -99.97, rgn: true },
  GCK: { name: "Garden City Regional", lat: 37.93, lon: -100.72, rgn: true },
  COS: { name: "Colorado Springs", lat: 38.81, lon: -104.7 },
  SAF: { name: "Santa Fe Regional", lat: 35.62, lon: -106.09, rgn: true },
  LAS: { name: "Las Vegas Harry Reid", lat: 36.08, lon: -115.15 },
  ONT: { name: "Ontario Intl", lat: 34.06, lon: -117.6 },
  SNA: { name: "John Wayne (Orange County)", lat: 33.68, lon: -117.87 },
  IRK: { name: "Kirksville Regional", lat: 40.09, lon: -92.54, rgn: true },
  MSN: { name: "Madison Dane County", lat: 43.14, lon: -89.34 },
  LSE: { name: "La Crosse Regional", lat: 43.88, lon: -91.26, rgn: true },
  BRD: { name: "Brainerd Lakes", lat: 46.4, lon: -94.13, rgn: true },
  GFK: { name: "Grand Forks Intl", lat: 47.95, lon: -97.18, rgn: true },
  DVL: { name: "Devils Lake Regional", lat: 48.11, lon: -98.91, rgn: true },
  ISN: { name: "Williston Basin Intl", lat: 48.26, lon: -103.75, rgn: true },
  OLF: { name: "Wolf Point", lat: 48.09, lon: -105.57, rgn: true },
  GGW: { name: "Glasgow Valley County", lat: 48.21, lon: -106.61, rgn: true },
  HVR: { name: "Havre City–County", lat: 48.54, lon: -109.76, rgn: true },
  MWH: { name: "Moses Lake Grant County", lat: 47.21, lon: -119.32, rgn: true },
  EAT: { name: "Wenatchee Pangborn", lat: 47.4, lon: -120.21, rgn: true },
  PAE: { name: "Everett Paine Field", lat: 47.91, lon: -122.28 },
  PSC: { name: "Pasco Tri-Cities", lat: 46.26, lon: -119.12 },
  SMX: { name: "Santa Maria", lat: 34.9, lon: -120.46, rgn: true },
  BMI: { name: "Central Illinois Regional", lat: 40.48, lon: -88.92, rgn: true },
  CGI: { name: "Cape Girardeau Regional", lat: 37.23, lon: -89.57, rgn: true },
  JBR: { name: "Jonesboro Muni", lat: 35.83, lon: -90.65, rgn: true },
  TXK: { name: "Texarkana Regional", lat: 33.45, lon: -93.99, rgn: true },
  GGG: { name: "East Texas Regional", lat: 32.38, lon: -94.71, rgn: true },
  TYR: { name: "Tyler Pounds", lat: 32.35, lon: -95.4, rgn: true },
  ACT: { name: "Waco Regional", lat: 31.61, lon: -97.23, rgn: true },
  GRK: { name: "Killeen Regional", lat: 31.07, lon: -97.83, rgn: true },
  CMI: { name: "Champaign Willard", lat: 40.04, lon: -88.28, rgn: true },
  MWA: { name: "Marion Veterans", lat: 37.75, lon: -89.01, rgn: true },
  PAH: { name: "Paducah Barkley", lat: 37.06, lon: -88.77, rgn: true },
  LFT: { name: "Lafayette Regional", lat: 30.2, lon: -91.99 },
  LCH: { name: "Lake Charles Regional", lat: 30.13, lon: -93.22, rgn: true },
  DRT: { name: "Del Rio Intl", lat: 29.37, lon: -100.93, rgn: true },
  PHX: { name: "Phoenix Sky Harbor", lat: 33.43, lon: -112.01 },
  YUM: { name: "Yuma Intl", lat: 32.66, lon: -114.61, rgn: true },
  PSP: { name: "Palm Springs Intl", lat: 33.83, lon: -116.51 },
  AZO: { name: "Kalamazoo–Battle Creek", lat: 42.23, lon: -85.55, rgn: true },
  LAN: { name: "Lansing Capital Region", lat: 42.78, lon: -84.59, rgn: true },
  SHD: { name: "Shenandoah Valley", lat: 38.26, lon: -78.9, rgn: true },
  ROA: { name: "Roanoke–Blacksburg", lat: 37.33, lon: -79.98 },
  LWB: { name: "Greenbrier Valley", lat: 37.86, lon: -80.4, rgn: true },
  BKW: { name: "Beckley Raleigh County", lat: 37.79, lon: -81.12, rgn: true },
  CRW: { name: "Charleston Yeager", lat: 38.37, lon: -81.59 },
  HTS: { name: "Huntington Tri-State", lat: 38.37, lon: -82.56, rgn: true },
  CVG: { name: "Cincinnati/N. Kentucky", lat: 39.05, lon: -84.66 },
  IND: { name: "Indianapolis Intl", lat: 39.72, lon: -86.29 },
  CAE: { name: "Columbia Metropolitan", lat: 33.94, lon: -81.12 },
  TPA: { name: "Tampa Intl", lat: 27.98, lon: -82.53 },
  SFB: { name: "Orlando Sanford", lat: 28.78, lon: -81.24 },
  ORF: { name: "Norfolk Intl", lat: 36.9, lon: -76.2 },
  PHF: { name: "Newport News/Williamsburg", lat: 37.13, lon: -76.49, rgn: true },
  LEB: { name: "Lebanon Muni, NH", lat: 43.63, lon: -72.3, rgn: true },
  BTV: { name: "Burlington Intl", lat: 44.47, lon: -73.15 },
  RUT: { name: "Rutland Southern Vermont", lat: 43.53, lon: -72.95, rgn: true },
  PBG: { name: "Plattsburgh Intl", lat: 44.65, lon: -73.47, rgn: true },
  YUL: { name: "Montréal–Trudeau", lat: 45.47, lon: -73.74 },
  YYZ: { name: "Toronto Pearson", lat: 43.68, lon: -79.63 },
  YHM: { name: "Hamilton Munro", lat: 43.17, lon: -79.93, rgn: true },
  YVR: { name: "Vancouver Intl", lat: 49.19, lon: -123.18 },
  BLI: { name: "Bellingham Intl", lat: 48.79, lon: -122.54, rgn: true },
  GRR: { name: "Grand Rapids Ford", lat: 42.88, lon: -85.52 },
  FNT: { name: "Flint Bishop", lat: 42.97, lon: -83.74, rgn: true },
  COU: { name: "Columbia Regional, MO", lat: 38.82, lon: -92.22, rgn: true },
  UIN: { name: "Quincy Regional", lat: 39.94, lon: -91.19, rgn: true },
  GPT: { name: "Gulfport–Biloxi", lat: 30.41, lon: -89.07 },
  MOB: { name: "Mobile Regional", lat: 30.69, lon: -88.24 },
  SCK: { name: "Stockton Metro", lat: 37.89, lon: -121.24, rgn: true },
  FAT: { name: "Fresno Yosemite", lat: 36.78, lon: -119.72 },
  BFL: { name: "Bakersfield Meadows", lat: 35.43, lon: -119.06, rgn: true },
  MHT: { name: "Manchester–Boston", lat: 42.93, lon: -71.44 },
  PWM: { name: "Portland Intl Jetport, ME", lat: 43.65, lon: -70.31 },
};

// power: "electric" (overhead catenary) or "diesel"
// lf: estimated seat/berth occupancy (load factor) from public data — see Methodology
const ROUTES = [
  { name: "Northeast Corridor", power: "electric", lf: 0.52, stops: [["BOS", 0], ["BBY", 1], ["RTE", 11], ["PVD", 43], ["KIN", 70], ["WLY", 87], ["MYS", 97], ["NLC", 105], ["OSB", 123], ["NHV", 157], ["BRP", 174], ["STM", 197], ["NRO", 215], ["NYP", 231], ["NWK", 241], ["EWR", 244], ["MET", 256], ["NBK", 264], ["PJC", 279], ["TRE", 289], ["CWH", 305], ["PHL", 322], ["WIL", 347], ["NRK", 359], ["ABE", 383], ["BAL", 415], ["BWI", 425], ["NCR", 447], ["WAS", 456]] },
  { name: "Keystone Service", power: "electric", lf: 0.45, stops: [["PHL", 0], ["ARD", 9], ["PAO", 20], ["EXT", 28], ["DWT", 33], ["COV", 39], ["PAR", 45], ["LNC", 68], ["MTJ", 80], ["ETN", 86], ["MDN", 95], ["HAR", 104]] },
  { name: "Empire Service", power: "diesel", lf: 0.45, stops: [["NYP", 0], ["YNY", 15], ["CRT", 33], ["POU", 73], ["RHI", 88], ["HUD", 114], ["ALB", 141], ["SDY", 158], ["AMS", 175], ["UCA", 237], ["ROM", 252], ["SYR", 291], ["ROC", 371], ["BUF", 437], ["BFX", 444], ["NFL", 460]] },
  { name: "Lake Shore Limited (Boston section)", power: "diesel", lf: 0.55, stops: [["BOS", 0], ["FRA", 21], ["WOR", 44], ["SPG", 98], ["PTF", 151], ["ALB", 200]] },
  { name: "Lake Shore Limited", power: "diesel", lf: 0.55, stops: [["BUF", 0], ["ERI", 88], ["CLE", 183], ["ELY", 208], ["SKY", 249], ["TOL", 296], ["BRY", 350], ["WTL", 390], ["EKH", 421], ["SOB", 436], ["CHI", 525]] },
  { name: "Floridian (former Capitol Limited)", power: "diesel", lf: 0.55, stops: [["WAS", 0], ["RKV", 16], ["HFY", 72], ["MRT", 93], ["CUM", 178], ["CNV", 244], ["PGH", 300], ["ALC", 380], ["CLE", 440], ["ELY", 465], ["SKY", 506], ["TOL", 550], ["WTL", 645], ["EKH", 676], ["SOB", 691], ["CHI", 780]] },
  { name: "Pennsylvanian", power: "diesel", lf: 0.45, stops: [["HAR", 0], ["LEW", 61], ["HUN", 92], ["TYR", 116], ["ALT", 130], ["JST", 168], ["LTB", 208], ["GBG", 218], ["PGH", 249]] },
  { name: "Crescent", power: "diesel", lf: 0.55, stops: [["WAS", 0], ["AXD", 8], ["MSS", 34], ["CLP", 74], ["CVS", 115], ["LYN", 174], ["DAN", 240], ["GRO", 320], ["HPT", 336], ["SLB", 373], ["CLT", 413], ["GAS", 435], ["SPB", 490], ["GRV", 520], ["CSN", 550], ["TCA", 583], ["GNS", 610], ["ATL", 637], ["ANN", 730], ["BHM", 805], ["TCL", 860], ["MER", 950], ["LAU", 1010], ["HBG", 1035], ["PIC", 1090], ["SDL", 1115], ["NOL", 1146]] },
  { name: "Silver Meteor", power: "diesel", lf: 0.55, stops: [["WAS", 0], ["AXD", 8], ["RVR", 110], ["PTB", 135], ["RMT", 200], ["FTV", 280], ["FLN", 355], ["KTR", 420], ["CHS", 475], ["YEM", 530], ["SAV", 590], ["JSP", 650], ["JAX", 732], ["PLK", 790], ["DLD", 830], ["WPK", 866], ["ORL", 874], ["KIS", 892], ["WTH", 930], ["SEB", 975], ["WPB", 1040], ["DLB", 1058], ["DFB", 1068], ["FTL", 1082], ["HOL", 1090], ["MIA", 1109]] },
  { name: "California Zephyr", power: "diesel", lf: 0.55, stops: [["CHI", 0], ["NPV", 28], ["PCT", 104], ["GAL", 162], ["BRL", 205], ["MTP", 233], ["OTM", 280], ["OSC", 360], ["CRN", 393], ["OMA", 500], ["LCN", 555], ["HAS", 655], ["HLD", 700], ["MCC", 770], ["FMG", 960], ["DEN", 1038], ["WPR", 1104], ["GBY", 1130], ["GSC", 1222], ["GJC", 1310], ["GRR", 1490], ["HLP", 1550], ["PRV", 1563], ["SLC", 1608], ["ELK", 1840], ["WNN", 1960], ["RNO", 2198], ["TRU", 2233], ["CFX", 2280], ["RSV", 2330], ["SAC", 2352], ["DAV", 2365], ["MTZ", 2395], ["RCH", 2420], ["EMY", 2438]] },
  { name: "Southwest Chief", power: "diesel", lf: 0.55, stops: [["CHI", 0], ["NPV", 28], ["MDO", 83], ["GAL", 162], ["FMD", 233], ["LPL", 340], ["KCY", 437], ["LWR", 477], ["TOP", 504], ["NEW", 634], ["HUT", 668], ["DDG", 770], ["GDC", 820], ["LMR", 920], ["LJT", 973], ["TRI", 1054], ["RAT", 1077], ["LVN", 1187], ["LMY", 1275], ["ABQ", 1330], ["GLP", 1470], ["WLO", 1640], ["FLG", 1699], ["KNG", 1846], ["NDL", 1946], ["BAR", 2113], ["VIC", 2148], ["SNB", 2200], ["RIV", 2215], ["FUL", 2240], ["LAX", 2265]] },
  { name: "Empire Builder", power: "diesel", lf: 0.55, stops: [["CHI", 0], ["GLN", 17], ["MKE", 86], ["CBS", 150], ["PTG", 178], ["WDL", 190], ["TOH", 235], ["LAC", 280], ["WIN", 310], ["RDW", 370], ["MSP", 418], ["SCD", 483], ["STP", 545], ["DLK", 610], ["FAR", 654], ["GFS", 730], ["DVK", 820], ["RUG", 870], ["MOT", 900], ["STN", 960], ["WLN", 1020], ["WPT", 1120], ["GLA", 1170], ["MLT", 1220], ["HAV", 1310], ["SBY", 1443], ["CUT", 1466], ["BRO", 1489], ["GPK", 1500], ["ESM", 1533], ["WGL", 1562], ["WFH", 1608], ["LIB", 1698], ["SPT", 1810], ["SPK", 1879], ["EPH", 1990], ["WEN", 2030], ["EVR", 2160], ["EDM", 2180], ["SEA", 2206]] },
  { name: "Empire Builder (Portland section)", power: "diesel", lf: 0.55, stops: [["SPK", 0], ["PSO", 146], ["WSH", 216], ["BGN", 228], ["VAN", 360], ["PDX", 370]] },
  { name: "Coast Starlight", power: "diesel", lf: 0.55, stops: [["SEA", 0], ["TAC", 40], ["OLW", 74], ["CTL", 96], ["KEL", 137], ["VAN", 176], ["PDX", 186], ["SLM", 238], ["ALY", 267], ["EUG", 310], ["CMO", 437], ["KFS", 512], ["DUN", 617], ["RDD", 657], ["CIC", 727], ["SAC", 812], ["DAV", 825], ["MTZ", 860], ["EMY", 890], ["OKJ", 895], ["SJC", 940], ["SNS", 1010], ["PRB", 1117], ["SLO", 1147], ["SBA", 1267], ["OXN", 1300], ["VNC", 1345], ["BUA", 1360], ["LAX", 1377]] },
  { name: "Pacific Surfliner", power: "diesel", lf: 0.45, stops: [["SLO", 0], ["GVB", 13], ["GDL", 32], ["LPS", 55], ["GOL", 110], ["SBA", 120], ["CPT", 132], ["VEN", 152], ["OXN", 162], ["CAM", 172], ["MPK", 182], ["SIM", 190], ["CHW", 200], ["VNC", 210], ["BUA", 216], ["GDA", 221], ["LAX", 227], ["FUL", 252], ["ANA", 257], ["STA", 262], ["IRV", 270], ["SJP", 283], ["SCL", 290], ["OCE", 310], ["SOL", 328], ["OTS", 352], ["SAN", 355]] },
  { name: "Texas Eagle", power: "diesel", lf: 0.55, stops: [["CHI", 0], ["JOL", 37], ["PON", 92], ["BLM", 124], ["LIL", 156], ["SPI", 185], ["CRV", 226], ["ALN", 258], ["STL", 284], ["ARC", 380], ["PPB", 450], ["WRD", 500], ["LRK", 629], ["MLV", 675], ["AKD", 695], ["HOP", 735], ["TXR", 765], ["MSH", 835], ["LGV", 858], ["MIN", 900], ["DAL", 974], ["FTW", 1008], ["CLB", 1060], ["MCG", 1110], ["TEM", 1140], ["TAY", 1180], ["AUS", 1216], ["SMC", 1246], ["SAS", 1306]] },
  { name: "City of New Orleans", power: "diesel", lf: 0.55, stops: [["CHI", 0], ["HMW", 25], ["KKE", 56], ["CHM", 128], ["MTN", 173], ["EFF", 200], ["CIL", 252], ["CBD", 310], ["FLT", 400], ["NWB", 445], ["MEM", 527], ["MKS", 590], ["GWD", 640], ["YAZ", 690], ["JAN", 737], ["HAZ", 775], ["BKH", 800], ["MCB", 825], ["HMD", 875], ["NOL", 926]] },
  { name: "Sunset Limited", power: "diesel", lf: 0.55, stops: [["NOL", 0], ["SCH", 55], ["NIB", 125], ["LFY", 145], ["LKC", 220], ["BMT", 290], ["HOS", 363], ["SAS", 573], ["DRO", 725], ["SND", 850], ["ALP", 930], ["ELP", 1153], ["DEM", 1240], ["LDB", 1300], ["BEN", 1425], ["TUS", 1470], ["MAR", 1560], ["YMA", 1720], ["PSG", 1850], ["ONA", 1950], ["POM", 1960], ["LAX", 1995]] },
  { name: "Wolverine", power: "diesel", lf: 0.45, stops: [["CHI", 0], ["NBF", 70], ["NIL", 95], ["DWG", 110], ["KZO", 138], ["BTC", 162], ["ABN", 190], ["JXN", 210], ["ARB", 243], ["DRB", 265], ["DET", 281], ["RYO", 295], ["TRY", 302], ["PTC", 310]] },
  { name: "Heartland Flyer", power: "diesel", lf: 0.45, stops: [["FTW", 0], ["GTX", 65], ["ADM", 100], ["PVY", 140], ["PUR", 160], ["NRM", 175], ["OKC", 206]] },
  { name: "Cardinal", power: "diesel", lf: 0.55, stops: [["WAS", 0], ["MSS", 34], ["CLP", 74], ["CVS", 115], ["STU", 155], ["CFG", 200], ["WSS", 235], ["ALS", 255], ["HIN", 265], ["PRC", 290], ["CWV", 350], ["HTG", 400], ["AKY", 415], ["MYV", 490], ["CIN", 555], ["CNS", 625], ["IPS", 680], ["CWF", 725], ["LFI", 750], ["REN", 790], ["DYE", 850], ["CHI", 880]] },
  { name: "Silver Star", power: "diesel", lf: 0.55, stops: [["WAS", 0], ["AXD", 8], ["RVR", 110], ["PTB", 135], ["SEL", 210], ["RAL", 240], ["CRY", 248], ["SPN", 300], ["HML", 330], ["CMD", 395], ["CLA", 425], ["DNK", 475], ["SAV", 575], ["JAX", 717], ["PLK", 775], ["DLD", 815], ["WPK", 851], ["ORL", 859], ["KIS", 877], ["LKL", 930], ["TAM", 963]] },
  { name: "Silver Star (Tampa–Miami section)", power: "diesel", lf: 0.55, stops: [["TAM", 0], ["LKL", 33], ["SEB", 105]] },
  { name: "Auto Train", power: "diesel", lf: 0.55, stops: [["LOR", 0], ["SFD", 855]] },
  { name: "Auto Train terminal access", power: "diesel", lf: 0.55, stops: [["AXD", 0], ["LOR", 18]] },
  { name: "Auto Train terminal access", power: "diesel", lf: 0.55, stops: [["DLD", 0], ["SFD", 22]] },
  { name: "Vermonter / Hartford Line", power: "diesel", lf: 0.45, stops: [["NHV", 0], ["MRD", 18], ["HFD", 37], ["WLC", 49], ["SPG", 62], ["HOK", 70], ["NHP", 80], ["GFD", 98], ["BRT", 120], ["BLF", 145], ["CLM", 165], ["WRJ", 195], ["RDP", 220], ["MPL", 245], ["WBY", 255], ["EJC", 275], ["SAB", 300]] },
  { name: "Ethan Allen Express", power: "diesel", lf: 0.45, stops: [["ALB", 0], ["SSP", 38], ["FED", 58], ["WHL", 78], ["CAS", 95], ["RTL", 110], ["MDB", 145], ["VRG", 158], ["BRG", 180]] },
  { name: "Adirondack", power: "diesel", lf: 0.45, stops: [["ALB", 0], ["SSP", 38], ["FED", 58], ["WHL", 78], ["TIC", 100], ["WSP", 125], ["PKT", 150], ["PLB", 165], ["RSP", 190], ["SLU", 235], ["MTL", 240]] },
  { name: "Carolinian / Piedmont", power: "diesel", lf: 0.45, stops: [["RAL", 0], ["CRY", 8], ["DRM", 25], ["BNC", 65], ["GRO", 85], ["HPT", 101], ["SLB", 138], ["KAN", 155], ["CLT", 178]] },
  { name: "Northeast Regional (Norfolk)", power: "diesel", lf: 0.45, stops: [["PTB", 0], ["NFK", 80]] },
  { name: "Northeast Regional (Newport News)", power: "diesel", lf: 0.45, stops: [["RVR", 0], ["WMB", 50], ["NPN", 75]] },
  { name: "Northeast Regional (Roanoke)", power: "diesel", lf: 0.45, stops: [["LYN", 0], ["RNK", 55]] },
  { name: "Pere Marquette", power: "diesel", lf: 0.45, stops: [["CHI", 0], ["SJM", 90], ["BGR", 110], ["HLM", 145], ["GRP", 176]] },
  { name: "Blue Water", power: "diesel", lf: 0.45, stops: [["CHI", 0], ["KZO", 138], ["BTC", 162], ["ELN", 210], ["DUR", 235], ["FLI", 250], ["LAP", 270], ["PHU", 320]] },
  { name: "Missouri River Runner", power: "diesel", lf: 0.45, stops: [["STL", 0], ["KWD", 13], ["WMO", 55], ["HRM", 80], ["JEF", 125], ["SED", 190], ["WAR", 220], ["LSU", 255], ["IDP", 270], ["KCY", 283]] },
  { name: "Illinois Zephyr / Carl Sandburg", power: "diesel", lf: 0.45, stops: [["CHI", 0], ["NPV", 28], ["PLN", 52], ["MDO", 83], ["PCT", 104], ["KEW", 131], ["GAL", 162], ["MAC", 200], ["QCY", 258]] },
  { name: "Mardi Gras Service", power: "diesel", lf: 0.45, stops: [["NOL", 0], ["BSL", 55], ["GLF", 70], ["BIL", 82], ["PAS", 105], ["MBL", 145]] },
  { name: "San Joaquins", power: "diesel", lf: 0.45, stops: [["OKJ", 0], ["RCH", 10], ["MTZ", 30], ["ANT", 48], ["STK", 83], ["MOD", 113], ["TUR", 126], ["MCD", 152], ["MAD", 182], ["FRE", 207], ["HAN", 240], ["COR", 260], ["WSO", 292], ["BKF", 315]] },
  { name: "Capitol Corridor", power: "diesel", lf: 0.45, stops: [["SJC", 0], ["SCC", 4], ["FRM", 20], ["HAY", 30], ["OKJ", 42], ["EMY", 46], ["BRK", 49], ["RCH", 54], ["MTZ", 74], ["SUI", 90], ["DAV", 110], ["SAC", 125], ["RSV", 143], ["RCK", 148], ["AUB", 160]] },
  { name: "Downeaster", power: "diesel", lf: 0.45, stops: [["BON", 0], ["WOB", 12], ["HVL", 33], ["EXE", 50], ["DNH", 60], ["DOV", 67], ["SCO", 98], ["OOB", 101], ["PME", 114], ["FRP", 130], ["BRW", 142]] },
  { name: "Boston cross-town transfer (MBTA)", power: "electric", lf: 0.45, stops: [["BOS", 0], ["BON", 2]] },
  { name: "Amtrak Cascades (Seattle–Vancouver BC)", power: "diesel", lf: 0.45, stops: [["SEA", 0], ["EDM", 18], ["EVR", 34], ["STW", 55], ["MVW", 65], ["BEL", 90], ["VBC", 156]] },
  { name: "Maple Leaf (Ontario section)", power: "diesel", lf: 0.45, stops: [["NFL", 0], ["NFO", 2], ["SCA", 14], ["ALD", 45], ["OKV", 57], ["TOR", 82]] },
];

const ROUTE_LF = Object.fromEntries(ROUTES.map((r) => [r.name, r.lf]));

// Corridors also served by trains not separately modeled (schedules differ; emissions are similar)
const ALT_CORRIDORS = [
  { ids: ["CHI", "GLN", "MKE"], note: "Hiawatha trains also run Chicago–Milwaukee on this corridor." },
  { ids: ["CHI", "GLN", "MKE", "CBS", "PTG", "WDL", "TOH", "LAC", "WIN", "RDW", "MSP"], note: "The Borealis also runs Chicago–St. Paul on this corridor." },
  { ids: ["CHI", "JOL", "PON", "BLM", "LIL", "SPI", "CRV", "ALN", "STL"], note: "Lincoln Service trains also run Chicago–St. Louis on this corridor." },
  { ids: ["CHI", "HMW", "KKE", "CHM", "MTN", "EFF", "CIL", "CBD"], note: "Illini/Saluki trains also run Chicago–Carbondale on this corridor." },
  { ids: ["SEA", "TAC", "OLW", "CTL", "KEL", "VAN", "PDX", "SLM", "ALY", "EUG"], note: "Amtrak Cascades trains also run Seattle–Eugene on this corridor." },
  { ids: ["DEN", "WPR"], note: "The seasonal Winter Park Express also runs Denver–Winter Park." },
];
const CANADIAN_AIRPORTS = ["YVR", "YYZ", "YHM", "YUL"];

/* ============================================================
   EMISSION FACTORS (see Methodology panel for sources)
   ============================================================ */
const F = {
  railDiesel: 127, // g CO2 per passenger-mile @ baseline load (EPA, 2018 Amtrak data)
  railElectric: 61, // g CO2 per passenger-mile @ baseline load (EPA, NEC grid mix)
  baselineLoad: 0.51, // approx. Amtrak system seat-occupancy the factors embed
  carPerVehicleMile: 234, // g CO2 per vehicle-mile: 2020 Honda CR-V Hybrid, 38 mpg EPA combined (8,887 g CO2/gal ÷ 38)
  avgCarPerVehicleMile: 400, // g CO2 per vehicle-mile: average U.S. gasoline car (EPA) — used for airport drive legs
  kgPerGallonGas: 8.887, // kg CO2 per gallon of gasoline (EPA)
  americanKgPerDay: 44, // avg American footprint ≈ 16 t CO2/yr ≈ 44 kg/day
  climateBudgetKg: 2400, // Paris-aligned per-person annual budget ≈ 2.4 t CO2
  airTiers: [
    // [max great-circle miles, g CO2 per passenger-mile]
    [300, 250],
    [700, 200],
    [1500, 170],
    [Infinity, 150],
  ],
  drivingDetour: 1.18, // road distance ≈ great-circle × 1.18
  flightDetour: 1.05, // flight distance ≈ great-circle × 1.05
  // time estimation
  transferHours: 2.5, // typical allowance per train connection
  carMph: 60,
  carBreakHrsPer250mi: 0.5,
  planeCruiseMph: 500,
  planeTaxiClimbHrs: 0.75,
  airportOverheadHrs: 2.0,
};

// Average endpoint-to-endpoint speeds incl. station dwells (Amtrak FY2022 reporting; NEC/state-corridor estimates)
function routeMph(routeName) {
  const r = ROUTES.find((x) => x.name === routeName);
  if (r.name === "Northeast Corridor") return 65;
  return r.lf === 0.55 ? 48 : 50; // long-distance 48 mph; state-supported corridors ~50
}

const fmtHr = (h) => `${Math.round(h)} hr${h >= 24 ? ` (~${(h / 24).toFixed(1)} days)` : ""}`;

/* ============================================================
   GRAPH — build adjacency from route stop lists, run Dijkstra
   ============================================================ */
function buildGraph() {
  const adj = {};
  const add = (a, b, dist, route, power) => {
    (adj[a] = adj[a] || []).push({ to: b, dist, route, power });
  };
  for (const r of ROUTES) {
    for (let i = 0; i < r.stops.length - 1; i++) {
      const [a, ma] = r.stops[i];
      const [b, mb] = r.stops[i + 1];
      const d = Math.abs(mb - ma);
      add(a, b, d, r.name, r.power);
      add(b, a, d, r.name, r.power);
    }
  }
  return adj;
}
const GRAPH = buildGraph();

const TRANSFER_PENALTY = 25; // virtual miles: prefer staying on one train

function shortestPath(from, to) {
  const dist = { [from]: 0 }; // cost including transfer penalties (for search)
  const real = { [from]: 0 }; // actual rail miles (for display & emissions)
  const routeAt = { [from]: null };
  const prev = {};
  const visited = new Set();
  while (true) {
    let u = null;
    let best = Infinity;
    for (const k in dist) {
      if (!visited.has(k) && dist[k] < best) {
        best = dist[k];
        u = k;
      }
    }
    if (u === null) return null;
    if (u === to) break;
    visited.add(u);
    for (const e of GRAPH[u] || []) {
      const penalty = routeAt[u] && routeAt[u] !== e.route ? TRANSFER_PENALTY : 0;
      const nd = dist[u] + e.dist + penalty;
      if (nd < (dist[e.to] ?? Infinity)) {
        dist[e.to] = nd;
        real[e.to] = real[u] + e.dist;
        routeAt[e.to] = e.route;
        prev[e.to] = { from: u, edge: e };
      }
    }
  }
  // Reconstruct edge list, then merge consecutive edges on the same route
  const edges = [];
  let cur = to;
  while (cur !== from) {
    const p = prev[cur];
    edges.unshift({ from: p.from, to: cur, ...p.edge });
    cur = p.from;
  }
  const legs = [];
  for (const e of edges) {
    const last = legs[legs.length - 1];
    if (last && last.route === e.route) {
      last.miles += e.dist;
      last.to = e.to;
    } else {
      legs.push({ route: e.route, power: e.power, from: e.from, to: e.to, miles: e.dist });
    }
  }
  return { totalMiles: real[to], legs };
}

function greatCircleMiles(a, b) {
  const R = 3958.8;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* ============================================================
   THEME
   ============================================================ */
const C = {
  paper: "#F1F3F0",
  card: "#FFFFFF",
  ink: "#182A44",
  inkSoft: "#5A6B82",
  line: "#D6DCD8",
  electric: "#0E7C5B",
  diesel: "#A85B1E",
  car: "#6B7B92",
  plane: "#8A6FA8",
  signal: "#BF3B2B",
};
const display = {
  fontFamily: "Futura, 'Century Gothic', 'Trebuchet MS', sans-serif",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
};
const mono = { fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace", fontVariantNumeric: "tabular-nums" };

/* ============================================================
   SMALL COMPONENTS
   ============================================================ */
function StationPicker({ label, value, onChange, excludeId }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = Object.entries(STATIONS)
      .filter(([id, s]) => id !== excludeId && (!q || s.name.toLowerCase().includes(q)))
      .sort((a, b) => a[1].name.localeCompare(b[1].name));
    return { shown: all.slice(0, 12), more: Math.max(0, all.length - 12) };
  }, [query, excludeId]);
  return (
    <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
      <div style={{ ...display, fontSize: 11, color: C.inkSoft, marginBottom: 6 }}>{label}</div>
      <input
        type="text"
        value={open ? query : STATIONS[value].name}
        placeholder="Type a city or station…"
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          fontSize: 15,
          color: C.ink,
          background: C.card,
          border: `1.5px solid ${C.line}`,
          borderRadius: 8,
        }}
      />
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 20,
            background: C.card,
            border: `1.5px solid ${C.line}`,
            borderRadius: 8,
            marginTop: 4,
            maxHeight: 280,
            overflowY: "auto",
            boxShadow: "0 8px 24px rgba(24,42,68,0.12)",
          }}
        >
          {matches.shown.map(([id, s]) => (
            <div
              key={id}
              onMouseDown={() => {
                onChange(id);
                setOpen(false);
              }}
              style={{ padding: "9px 12px", fontSize: 14, cursor: "pointer", borderBottom: `1px solid ${C.paper}` }}
            >
              {s.name}
            </div>
          ))}
          {matches.more > 0 && (
            <div style={{ padding: "8px 12px", fontSize: 12, color: C.inkSoft }}>+{matches.more} more — keep typing to narrow</div>
          )}
          {matches.shown.length === 0 && <div style={{ padding: "8px 12px", fontSize: 12, color: C.inkSoft }}>No stations match "{query}"</div>}
        </div>
      )}
    </div>
  );
}

function JourneyStrip({ legs, totalMiles, fromId, toId }) {
  const W = 640;
  const H = 92;
  const pad = 26;
  const usable = W - pad * 2;
  let x = pad;
  const segs = legs.map((l) => {
    const w = (l.miles / totalMiles) * usable;
    const seg = { x, w, ...l };
    x += w;
    return seg;
  });
  const y = 44;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Journey diagram by power type">
      {segs.map((s, i) => (
        <g key={i}>
          <line x1={s.x} y1={y} x2={s.x + s.w} y2={y} stroke={s.power === "electric" ? C.electric : C.diesel} strokeWidth={5} strokeLinecap="butt" />
          {s.power === "electric" && (
            <line x1={s.x} y1={y - 9} x2={s.x + s.w} y2={y - 9} stroke={C.electric} strokeWidth={1.5} strokeDasharray="5 4" opacity={0.65} />
          )}
          {s.w > 70 && (
            <text x={s.x + s.w / 2} y={y + 22} textAnchor="middle" fontSize={10} fill={C.inkSoft} style={{ fontFamily: "system-ui" }}>
              {s.route} · {Math.round(s.miles)} mi
            </text>
          )}
        </g>
      ))}
      {[pad, ...segs.map((s) => s.x + s.w)].map((cx, i) => {
        const isEnd = i === 0 || i === segs.length;
        return <circle key={i} cx={cx} cy={y} r={isEnd ? 6 : 4.5} fill={isEnd ? C.ink : C.card} stroke={C.ink} strokeWidth={2} />;
      })}
      <text x={pad} y={y - 20} fontSize={11} fill={C.ink} fontWeight={700} style={{ fontFamily: "system-ui" }}>
        {STATIONS[fromId].name.split(",")[0]}
      </text>
      <text x={W - pad} y={y - 20} textAnchor="end" fontSize={11} fill={C.ink} fontWeight={700} style={{ fontFamily: "system-ui" }}>
        {STATIONS[toId].name.split(",")[0]}
      </text>
    </svg>
  );
}

function CompareBar({ label, kg, max, color, note }) {
  const pct = Math.max(4, (kg / max) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ ...display, fontSize: 11, color: C.ink }}>{label}</span>
        <span style={{ ...mono, fontSize: 13, color: C.ink, fontWeight: 700 }}>{kg.toFixed(0)} kg</span>
      </div>
      <div style={{ height: 14, background: C.paper, borderRadius: 7, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 7, transition: "width .5s ease" }} />
      </div>
      {note && <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 3 }}>{note}</div>}
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function AmtrakCarbon() {
  const [fromId, setFromId] = useState("WAS");
  const [toId, setToId] = useState("CHI");
  const [travelers, setTravelers] = useState(1); // seat-occupying members of your party
  const [showDetails, setShowDetails] = useState(false);

  const result = useMemo(() => {
    if (fromId === toId) return null;
    const path = shortestPath(fromId, toId);
    if (!path) return null;

    let railGrams = 0;
    let dieselMiles = 0;
    let electricMiles = 0;
    let loadWeighted = 0;
    const legDetails = path.legs.map((l) => {
      const lf = ROUTE_LF[l.route];
      const base = l.power === "electric" ? F.railElectric : F.railDiesel;
      const uplift = l.route === "Auto Train" ? 1.8 : 1; // vehicle carriage — see Methodology
      const g = base * uplift * (F.baselineLoad / lf) * l.miles;
      railGrams += g;
      loadWeighted += lf * l.miles;
      if (l.power === "electric") electricMiles += l.miles;
      else dieselMiles += l.miles;
      return { ...l, lf, kg: (g / 1000) * travelers, hours: l.miles / routeMph(l.route) };
    });
    const avgLoad = loadWeighted / path.totalMiles;
    const transfers = path.legs.length - 1;

    // Itinerary notes: alternate services, Boston cross-town transfer, border crossings
    const notes = [];
    if (path.legs.some((l) => l.route === "Northeast Corridor")) {
      notes.push("Acela trains also run this electrified corridor — faster schedules, similar emissions.");
    }
    for (const c of ALT_CORRIDORS) {
      if (c.ids.includes(fromId) && c.ids.includes(toId)) notes.push(c.note);
    }
    if (path.legs.some((l) => l.route.includes("Boston cross-town"))) {
      notes.push(
        "The Downeaster uses Boston North Station, which has no rail link to South Station — this itinerary includes a cross-town transfer (MBTA subway or taxi), counted here as connections."
      );
    }
    if (path.legs.some((l) => l.route === "Auto Train")) {
      notes.push("The Auto Train carries passengers and their vehicles nonstop between Lorton, VA and Sanford, FL — its emissions use a 1.8× uplift for the extra vehicle tonnage, and 'terminal access' legs represent short drives to its dedicated terminals. Remember: your car rides with you, replacing an 855-mile drive.");
    }
    const touchesCanada = path.legs.some((l) => CANADIAN_AIRPORTS.includes(STATIONS[l.from].ap) || CANADIAN_AIRPORTS.includes(STATIONS[l.to].ap));
    if (touchesCanada) {
      notes.push("This itinerary crosses the US–Canada border: customs typically adds 1–2 hours not included in the time estimate, and the flight comparison may involve international fares and airports.");
    }
    const perPaxRailKg = railGrams / 1000;
    const railKg = perPaxRailKg * travelers;
    const railHours = legDetails.reduce((s, l) => s + l.hours, 0) + transfers * F.transferHours;

    const gc = greatCircleMiles(STATIONS[fromId], STATIONS[toId]);
    const driveMiles = gc * F.drivingDetour;
    const carKg = (driveMiles * F.carPerVehicleMile) / 1000; // vehicle total — same for 1 or 5 aboard
    const carHours = driveMiles / F.carMph + (driveMiles / 250) * F.carBreakHrsPer250mi;

    // Plane: real airports. Flight is airport-to-airport; ground legs are driven in an average gas car.
    const apFrom = AIRPORTS[STATIONS[fromId].ap];
    const apTo = AIRPORTS[STATIONS[toId].ap];
    const sameAirport = STATIONS[fromId].ap === STATIONS[toId].ap;
    const airGc = sameAirport ? 0 : greatCircleMiles(apFrom, apTo);
    const flyMiles = airGc * F.flightDetour;
    const groundMiles =
      (greatCircleMiles(STATIONS[fromId], apFrom) + greatCircleMiles(apTo, STATIONS[toId])) * F.drivingDetour;
    const tier = F.airTiers.find(([max]) => airGc <= max);
    const planeViable = !sameAirport && airGc >= 120;
    const planeKg = planeViable
      ? ((flyMiles * tier[1]) / 1000) * travelers + (groundMiles * F.avgCarPerVehicleMile) / 1000
      : null;
    const planeHours = planeViable
      ? groundMiles / F.carMph + flyMiles / F.planeCruiseMph + F.planeTaxiClimbHrs + F.airportOverheadHrs
      : null;
    const planeRegional = planeViable && (apFrom.rgn || apTo.rgn);

    return {
      ...path,
      legDetails,
      railKg,
      perPaxRailKg,
      railHours,
      dieselMiles,
      electricMiles,
      avgLoad,
      transfers,
      notes,
      gc,
      driveMiles,
      carKg,
      carHours,
      flyMiles,
      planeKg,
      planeHours,
      groundMiles,
      apFrom: STATIONS[fromId].ap,
      apTo: STATIONS[toId].ap,
      sameAirport,
      planeRegional,
    };
  }, [fromId, toId, travelers]);

  const maxKg = result ? Math.max(result.railKg, result.carKg, result.planeKg || 0) : 1;
  const winner = result
    ? [
        ["train", result.railKg],
        ["car", result.carKg],
        ...(result.planeKg ? [["plane", result.planeKg]] : []),
      ].sort((a, b) => a[1] - b[1])[0][0]
    : null;

  const sliderStyle = { width: "100%", accentColor: C.ink };

  return (
    <div style={{ minHeight: "100vh", background: C.paper, color: C.ink, fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: 48 }}>
      {/* Header band — station-sign style */}
      <header style={{ background: C.ink, color: "#F5F7F4", padding: "26px 20px 22px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ ...display, fontSize: 12, opacity: 0.7, marginBottom: 6 }}>Amtrak network · United States</div>
          <h1 style={{ ...display, fontSize: "clamp(22px, 4vw, 32px)", margin: 0, fontWeight: 700, letterSpacing: "0.16em" }}>
            Rail Carbon
          </h1>
          <div style={{ fontSize: 14, opacity: 0.8, marginTop: 6 }}>
            Estimate the CO₂ footprint of a train trip — and see how driving or flying compares.
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px" }}>
        {/* Trip controls */}
        <section style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: 20, marginTop: 20, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <StationPicker label="From" value={fromId} onChange={setFromId} excludeId={toId} />
            <button
              onClick={() => {
                setFromId(toId);
                setToId(fromId);
              }}
              aria-label="Swap origin and destination"
              style={{ padding: "10px 14px", border: `1.5px solid ${C.line}`, background: C.paper, borderRadius: 8, cursor: "pointer", fontSize: 15, color: C.ink }}
            >
              ⇄
            </button>
            <StationPicker label="To" value={toId} onChange={setToId} excludeId={fromId} />
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 20, alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ ...display, fontSize: 11, color: C.inkSoft, marginBottom: 6 }}>
                Travelers in your party — <span style={{ ...mono, color: C.ink }}>{travelers}</span>
              </div>
              <input type="range" min={1} max={6} value={travelers} onChange={(e) => setTravelers(+e.target.value)} style={sliderStyle} />
              <div style={{ fontSize: 11, color: C.inkSoft }}>
                Count seat-occupying travelers only — lap infants ride free on trains and planes and add essentially nothing to any mode.
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220, fontSize: 12, color: C.inkSoft, background: C.paper, borderRadius: 8, padding: "10px 12px", lineHeight: 1.6 }}>
              Comparisons show your party's total emissions: train and plane totals grow with each traveler, while the CR-V burns the same fuel no matter how many ride along.
            </div>
          </div>
        </section>

        {result && (
          <>
            {/* Headline result */}
            <section style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "22px 20px", marginBottom: 18 }}>
              <div>
                <div style={{ ...display, fontSize: 11, color: C.inkSoft }}>Your train trip</div>
                <div style={{ ...mono, fontSize: "clamp(34px, 7vw, 48px)", fontWeight: 700, lineHeight: 1.1 }}>
                  {result.railKg.toFixed(0)}
                  <span style={{ fontSize: 18, fontWeight: 400, color: C.inkSoft }}> kg CO₂</span>
                </div>
                <div style={{ fontSize: 13, color: C.inkSoft }}>
                  {travelers > 1
                    ? `party of ${travelers} · ${result.perPaxRailKg.toFixed(0)} kg per person · ≈${fmtHr(result.railHours)} aboard`
                    : `per passenger · ≈${fmtHr(result.railHours)} aboard`}
                  {result.transfers > 0 ? " incl. connections" : ""}
                </div>
              </div>

              {showDetails && (
                <>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: 13, color: C.inkSoft, marginTop: 14 }}>
                    <span>
                      <b style={{ ...mono, color: C.ink }}>{Math.round(result.totalMiles)}</b> rail miles
                      {result.transfers > 0 && <> · {result.transfers} transfer{result.transfers > 1 ? "s" : ""}</>}
                    </span>
                    <span>
                      <span style={{ color: C.diesel, fontWeight: 600 }}>{Math.round(result.dieselMiles)} mi diesel</span>
                      {" · "}
                      <span style={{ color: C.electric, fontWeight: 600 }}>{Math.round(result.electricMiles)} mi electric</span>
                    </span>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <JourneyStrip legs={result.legs} totalMiles={result.totalMiles} fromId={fromId} toId={toId} />
                  </div>

                  {/* Leg table */}
                  <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 12 }}>
                    {result.legDetails.map((l, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, padding: "5px 0", flexWrap: "wrap" }}>
                        <span>
                          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: l.power === "electric" ? C.electric : C.diesel, marginRight: 8 }} />
                          <b>{l.route}</b> — {STATIONS[l.from].name.split(",")[0]} → {STATIONS[l.to].name.split(",")[0]}
                        </span>
                        <span style={{ ...mono, color: C.inkSoft }}>
                          {Math.round(l.miles)} mi · {l.power} · est. {Math.round(l.lf * 100)}% full · {l.kg.toFixed(0)} kg
                        </span>
                      </div>
                    ))}
                  </div>
                  {result.notes.length > 0 && (
                    <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 10, paddingTop: 10 }}>
                      {result.notes.map((n, i) => (
                        <div key={i} style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.6, padding: "3px 0" }}>
                          ⓘ {n}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <button
                onClick={() => setShowDetails(!showDetails)}
                style={{ marginTop: 12, padding: "6px 14px", border: `1.5px solid ${C.line}`, background: C.paper, borderRadius: 8, cursor: "pointer", fontSize: 12, color: C.ink, ...display }}
              >
                {showDetails ? "Show less ▴" : "Show more ▾"}
              </button>
            </section>

            {/* Mode comparison */}
            <section style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "22px 20px", marginBottom: 18 }}>
              <div style={{ ...display, fontSize: 12, marginBottom: 16 }}>
                Same trip, other modes — {travelers > 1 ? `party of ${travelers}` : "one traveler"}
              </div>
              <CompareBar
                label={travelers > 1 ? `Train (party of ${travelers})` : "Train"}
                kg={result.railKg}
                max={maxKg}
                color={result.electricMiles > result.dieselMiles ? C.electric : C.diesel}
                note={`${Math.round(result.totalMiles)} rail mi · ≈${fmtHr(result.railHours)}${result.transfers > 0 ? " incl. connections" : ""}`}
              />
              <CompareBar
                label="CR-V Hybrid (vehicle total)"
                kg={result.carKg}
                max={maxKg}
                color={C.car}
                note={`≈${Math.round(result.driveMiles)} road mi · ≈${fmtHr(result.carHours)} driving — same total no matter how many ride along`}
              />
              {result.planeKg !== null ? (
                <>
                  <CompareBar
                    label={travelers > 1 ? `Plane, economy (party of ${travelers})` : "Plane (economy)"}
                    kg={result.planeKg}
                    max={maxKg}
                    color={C.plane}
                    note={`${result.apFrom} → ${result.apTo} · ≈${Math.round(result.flyMiles)} flight mi + ${Math.round(result.groundMiles)} mi drive to/from airports · ≈${fmtHr(result.planeHours)}`}
                  />
                  <div style={{ fontSize: 11, color: C.inkSoft, marginTop: -8, marginBottom: 6 }}>
                    Nonstop {AIRPORTS[result.apFrom].name} → {AIRPORTS[result.apTo].name}; airport drives in an average gas car.
                    {result.planeRegional && <b> Regional airport — connections likely.</b>}
                  </div>
                </>
              ) : result.sameAirport ? (
                <div style={{ fontSize: 12, color: C.inkSoft }}>
                  Flight comparison hidden — both stations are served by the same airport ({AIRPORTS[result.apFrom].name}), so flying isn't a real option.
                  This is where the train's advantage is absolute.
                </div>
              ) : (
                <div style={{ fontSize: 12, color: C.inkSoft }}>Flight comparison hidden — the nearest airports are too close together for a realistic flight.</div>
              )}
              <div style={{ marginTop: 14, padding: "10px 12px", background: C.paper, borderRadius: 8, fontSize: 13 }}>
                {winner === "train" ? (
                  <>🚆 <b>The train wins</b> for this trip{result.electricMiles > result.dieselMiles ? " — helped by the electrified miles" : ""}.</>
                ) : winner === "car" ? (
                  <>🚗 <b>The CR-V Hybrid edges out the train for your party{travelers > 1 ? ` of ${travelers}` : ""}</b> — one efficient vehicle beats {travelers > 1 ? `${travelers} seats' worth of` : "a seat on"} long-haul diesel rail.</>
                ) : (
                  <>✈️ <b>Flying edges out the train here</b> — over roughly 700 miles, diesel rail can emit more per passenger than a full single-aisle jet.</>
                )}
              </div>
            </section>

            {/* Context panel */}
            <section style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "22px 20px", marginBottom: 18 }}>
              <div style={{ ...display, fontSize: 12, marginBottom: 14 }}>Putting it in context</div>
              {(() => {
                const modes = [
                  ["train", result.railKg],
                  ["CR-V", result.carKg],
                  ...(result.planeKg !== null ? [["plane", result.planeKg]] : []),
                ].sort((a, b) => a[1] - b[1]);
                const [bestMode, bestKg] = modes[0];
                const [worstMode, worstKg] = modes[modes.length - 1];
                const savedKg = worstKg - bestKg;
                const days = result.perPaxRailKg / F.americanKgPerDay;
                const budgetDays = result.perPaxRailKg / (F.climateBudgetKg / 365);
                const row = { display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13, lineHeight: 1.6 };
                const num = { ...mono, fontWeight: 700, color: C.ink, fontSize: 20, minWidth: 86, textAlign: "right" };
                return (
                  <>
                    <div style={row}>
                      <div style={num}>{days < 1 ? days.toFixed(1) : Math.round(days)} {Math.round(days) === 1 && days >= 1 ? "day" : "days"}</div>
                      <div>
                        of an average American's emissions — this trip is {result.perPaxRailKg.toFixed(0)} kg per person; the typical American emits
                        ~44 kg every day.
                      </div>
                    </div>
                    <div style={row}>
                      <div style={num}>{(savedKg / F.kgPerGallonGas).toFixed(0)} gal</div>
                      <div>
                        of gasoline saved by taking the lowest-carbon option here ({bestMode}, {bestKg.toFixed(0)} kg) instead of the highest
                        ({worstMode}, {worstKg.toFixed(0)} kg) — about {Math.round((savedKg * 1000) / F.carPerVehicleMile)} miles of CR-V driving.
                      </div>
                    </div>
                    <div style={{ ...row, borderBottom: "none" }}>
                      <div style={num}>{budgetDays < 1 ? budgetDays.toFixed(1) : Math.round(budgetDays)} {Math.round(budgetDays) === 1 && budgetDays >= 1 ? "day" : "days"}</div>
                      <div>
                        of a climate-safe carbon budget — roughly 6.6 kg per person per day (~2.4 tonnes a year), about a sixth of what the average
                        American currently emits.
                      </div>
                    </div>
                  </>
                );
              })()}
            </section>

            {/* Methodology */}
            <details style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "16px 20px" }}>
              <summary style={{ ...display, fontSize: 12, cursor: "pointer" }}>Methodology & sources</summary>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: C.inkSoft, marginTop: 12 }}>
                <p style={{ marginTop: 0 }}>
                  <b style={{ color: C.ink }}>Rail factors.</b> Diesel service: <span style={mono}>127 g CO₂/passenger-mile</span>; electric (Northeast Corridor &
                  Keystone): <span style={mono}>61 g</span>. Derived from a U.S. EPA analysis of Amtrak's reported 2018 fuel and electricity use divided by
                  passenger-miles (0.280 and 0.134 lb/passenger-mile). These factors embed the system's real average occupancy, taken here as ~51% of seats.
                  Note the electric figure is not zero precisely because it reflects the real 2018 generation mix of the grids powering the corridor (PJM,
                  NYISO, ISO-New England — a blend of natural gas, nuclear, hydro, and renewables, with some coal). The Northeast grid has decarbonized since
                  2018, so 61 g is likely a mild overestimate of today's electric-rail emissions.
                </p>
                <p>
                  <b style={{ color: C.ink }}>Party accounting.</b> Comparisons show your party's total emissions using standard average attribution: each
                  seat-occupying traveler claims a proportional share of the train's or plane's emissions, so those totals scale with party size, while the
                  CR-V's total is fixed regardless of occupants. Lap infants occupy no seat and add essentially nothing on any mode. (A marginal-emissions view
                  would credit near-zero to boarding an already-scheduled train or flight, but average attribution is the defensible convention at scale.)
                </p>
                <p>
                  <b style={{ color: C.ink }}>Time estimates.</b> Train legs use average endpoint speeds including station stops — 48 mph on long-distance
                  routes (Amtrak FY2022 reporting), ~65 mph on the Northeast Corridor, ~50 mph on state corridors — plus 2.5 hr per connection. Driving assumes
                  60 mph plus a 30-minute break per 250 miles (labeled driving time; very long trips would realistically add overnight stops). Flying assumes
                  500 mph cruise, 45 minutes of taxi/climb/descent, 2 hr of airport overhead, and a nonstop routing. These are rough planning figures;
                  long-distance trains in particular are frequently delayed on freight-owned track.
                </p>
                <p>
                  <b style={{ color: C.ink }}>Occupancy.</b> Rather than a guess, each leg uses an estimated load factor from public reporting: Amtrak's white paper
                  on long-distance financial performance reports a <span style={mono}>55%</span> average load factor (seats and berths occupied) on long-distance
                  routes in FY2018 — the same year as the emission factors. The Northeast Corridor is set at <span style={mono}>~52%</span> and state-supported
                  corridors (Keystone, Empire Service, Pacific Surfliner, Pennsylvanian, Wolverine, Heartland Flyer) at <span style={mono}>~45%</span>, chosen so
                  the network blends back to the ~51% system average the EPA factors embed. Per-passenger emissions on each leg = factor × 51% ÷ that route's
                  occupancy.
                </p>
                <p>
                  <b style={{ color: C.ink }}>Rail distances.</b> Estimated from Amtrak timetable mileposts for {ROUTES.length} major routes ({Object.keys(STATIONS).length} stations).
                  Trips spanning routes are joined at shared hubs via shortest-path search, so mileages and transfer points are approximations of real itineraries.
                </p>
                <p>
                  <b style={{ color: C.ink }}>Car.</b> Based on a 2020 Honda CR-V Hybrid: EPA-rated 38 mpg combined, and gasoline emits 8,887 g CO₂ per gallon
                  (EPA), giving <span style={mono}>234 g CO₂/vehicle-mile</span>, shown as the whole vehicle's total. Road distance ≈ straight-line distance ×
                  1.18. For reference, the average U.S. gasoline car emits ~400 g/mile, so this comparison is notably tougher on the train than a typical-car
                  baseline.
                </p>
                <p>
                  <b style={{ color: C.ink }}>Plane.</b> Flights are priced between each station's nearest commercial airport (embedded for all{" "}
                  {Object.keys(AIRPORTS).length} airports serving the network), assuming a nonstop: distance-tiered economy factors of{" "}
                  <span style={mono}>250 g</span>/passenger-mile under 300 mi, <span style={mono}>200 g</span> to 700 mi, <span style={mono}>170 g</span> to
                  1,500 mi, <span style={mono}>150 g</span> beyond, with flight distance ≈ straight-line × 1.05. Drives between stations and airports are
                  added at <span style={mono}>400 g/vehicle-mile</span> (average U.S. gas car — assumed to be a rental or taxi, not the hybrid). Small
                  regional airports are flagged since they usually require connections, which add emissions beyond this estimate. Excludes non-CO₂
                  high-altitude effects, which would raise the plane's true climate impact.
                </p>
                <p>
                  <b style={{ color: C.ink }}>Service notes.</b> The Washington–Chicago route is modeled as the former Capitol Limited; since late 2024 Amtrak
                  operates this corridor as part of the Floridian (Chicago–Washington–Miami). Some corridors host additional trains not modeled separately
                  (Acela, Hiawatha, Borealis, Lincoln Service, Illini/Saluki, Cascades south of Seattle, Winter Park Express) — the trip details flag these,
                  since schedules differ while emissions are similar. Cross-border service to Vancouver BC, Toronto, and Montréal is included; customs time is
                  not. The Downeaster's Boston North Station terminal has no rail link to South Station, so itineraries crossing Boston include a flagged
                  cross-town transfer. Auto Train legs apply a 1.8× uplift to the diesel factor to account for hauling passengers' vehicles in autoracks — a
                  transparent assumption, since Amtrak publishes no train-specific fuel data.
                </p>
                <p>
                  <b style={{ color: C.ink }}>Coverage gaps.</b> The model spans every named Amtrak rail corridor but omits: Thruway bus connections (not
                  rail), the Palmetto and Acela as separately selectable services (their corridors are fully modeled and flagged), seasonal specials like the
                  Berkshire Flyer, and a handful of small flag stops on otherwise-complete routes. All mileposts are timetable-derived estimates.
                </p>
                <p>
                  <b style={{ color: C.ink }}>Context figures.</b> Average American footprint: ~16 t CO₂/person/year (≈44 kg/day), consumption-based
                  estimates for the U.S. Climate-safe budget: IPCC-derived 1.5 °C pathways imply roughly 2–2.5 t CO₂/person/year globally; this tool uses
                  2.4 t. Gasoline: 8,887 g CO₂/gallon (EPA). Atmospheric CO₂ passed 350 ppm in 1988 and is near 425 ppm today, which is why per-person
                  budgets rather than the 350 ppm threshold serve as the yardstick here.
                </p>
                <p style={{ marginBottom: 0 }}>
                  <b style={{ color: C.ink }}>Caveats.</b> All figures are CO₂ only (not full CO₂e), reflect system averages rather than specific trains, and rail
                  mileposts are estimates. Electric-rail emissions depend on the regional grid mix and will fall as the grid decarbonizes.
                </p>
              </div>
            </details>
          </>
        )}

        <footer style={{ textAlign: "center", fontSize: 11, color: C.inkSoft, marginTop: 24 }}>
          <span style={display}>Rail Carbon</span> · estimates for comparison, not offset accounting
        </footer>
      </main>
    </div>
  );
}
