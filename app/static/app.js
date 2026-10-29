/**
 * King County House Price Predictor - Frontend Client
 * Handles:
 * 1. Form state & Preset selection
 * 2. API Communication with POST /predict (Real ML model inference)
 * 3. Health check with GET /health
 * 4. Error and loading states (prevents duplicate submission)
 * 5. Dark Mode & Light Mode Theme Toggle with localStorage & OS detection
 * 6. Arabic / English Language Toggle with RTL/LTR layout switching
 */

// ---------------------------------------------------------------------------
// I18N: Translation Strings (English + Arabic)
// ---------------------------------------------------------------------------
const TRANSLATIONS = {
  en: {
    // Header
    brandBadge: 'King County ML Model',
    appTitle: 'House Price Predictor',
    appSubtitle: 'Accurate residential market valuations in Washington State powered by an optimized XGBoost Pipeline with R\u00b2 = 0.868.',
    swaggerDocs: 'Swagger API Docs',
    checkingApi: 'Checking API...',
    apiOnline: 'API & Model Online',
    modelLoading: 'Model Loading...',
    apiDegraded: 'API Degraded',
    backendOffline: 'Backend Offline',
    // Presets
    quickStart: 'Quick Start',
    loadPresets: 'Load Sample Real Estate Presets:',
    presetSuburbanTitle: 'Seattle Suburban',
    presetSuburbanDesc: '3 Bed, 2.25 Bath, Grade 7',
    presetLuxuryTitle: 'Waterfront Luxury',
    presetLuxuryDesc: '4 Bed, 3.5 Bath, Waterfront, Grade 10',
    presetCottageTitle: 'Cozy Starter Home',
    presetCottageDesc: '2 Bed, 1.0 Bath, Grade 6',
    presetBellevueTitle: 'Bellevue Executive',
    presetBellevueDesc: '5 Bed, 4.0 Bath, Grade 9',
    // Form
    formCardTitle: 'Property Characteristics',
    formCardSubtitle: 'Provide actual house specifications to receive an instant ML valuation.',
    groupCoreStructure: 'Core Structure',
    groupAreaLiving: 'Area & Living Space (sq ft)',
    groupQualityRating: 'Quality & Rating',
    groupLocation: 'Location & Construction Year',
    labelBedrooms: 'Bedrooms',
    hintBedrooms: 'e.g. 3',
    labelBathrooms: 'Bathrooms',
    hintBathrooms: 'e.g. 2.25',
    labelFloors: 'Floors',
    hintFloors: 'e.g. 2.0',
    labelSqftLiving: 'Living Space (sqft)',
    hintSqftLiving: 'Total interior living area',
    labelSqftLot: 'Lot Size (sqft)',
    hintSqftLot: 'Land parcel area',
    labelSqftAbove: 'Above Ground (sqft)',
    hintSqftAbove: 'Excludes basement',
    labelSqftBasement: 'Basement Area (sqft)',
    hintSqftBasement: '0 if no basement',
    labelWaterfront: 'Waterfront',
    optNo: 'No',
    optYes: 'Yes',
    hintWaterfront: 'Shoreline access',
    labelView: 'View Score',
    view0: '0 - None',
    view1: '1 - Fair',
    view2: '2 - Average',
    view3: '3 - Good',
    view4: '4 - Excellent',
    hintView: '0-4 scale',
    labelCondition: 'Condition',
    hintCondition: '1-5 scale',
    labelGrade: 'Building Grade',
    hintGrade: 'King County grade 1-13 (avg = 7)',
    labelYrBuilt: 'Year Built',
    hintYrBuilt: 'e.g. 1951',
    labelYrRenovated: 'Year Renovated',
    hintYrRenovated: '0 if never renovated',
    labelZipcode: 'King Co. Zipcode',
    hintZipcode: 'e.g. 98125',
    labelLat: 'Latitude',
    hintLat: '47.15 to 47.78',
    labelLong: 'Longitude',
    hintLong: '-122.52 to -121.31',
    labelSqftLiving15: 'Neighbors Avg Living (sqft)',
    hintSqftLiving15: 'Nearest 15 homes',
    labelSqftLot15: 'Neighbors Avg Lot (sqft)',
    hintSqftLot15: 'Nearest 15 parcels',
    btnCalculate: 'Calculate Estimated Price',
    btnCalculating: 'Calculating Prediction...',
    btnReset: 'Reset Fields',
    // Results
    resultCardTitle: 'Model Prediction Output',
    resultCardSubtitle: 'Live inference result returned by the FastAPI prediction pipeline.',
    errorTitle: 'Request Error',
    errorMessage: 'Unable to process the prediction request.',
    predictionFailed: 'Prediction Failed',
    networkError: 'Network error: Unable to reach the backend API. Please ensure the server is running on the expected port.',
    emptyStateTitle: 'Ready for Prediction',
    emptyStateDesc: 'Adjust the property parameters or pick a preset scenario, then click Calculate Estimated Price to see the real ML inference.',
    estimatedMarketValue: 'Estimated Market Value',
    derivedFeaturesTitle: 'Calculated Derived Features & Key Highlights',
    metricHouseAge: 'House Age (2015 Base)',
    metricTotalRooms: 'Total Rooms (Beds + Baths)',
    metricCountyGrade: 'County Grade',
    metricWaterfrontAccess: 'Waterfront Access',
    metricYears: 'Years',
    metricRooms: 'Rooms',
    metricYes: 'Yes',
    metricNo: 'No',
    topDriversTitle: 'Top Model Valuation Drivers',
    topDriversSubtext: 'Based on XGBoost Feature Importance',
    driver1Name: 'Grade (27.6%)',
    driver1Desc: 'King County structural craftsmanship & architectural level.',
    driver2Name: 'Waterfront (22.2%)',
    driver2Desc: 'Premium waterfront shoreline access.',
    driver3Name: 'Living Space (16.7%)',
    driver3Desc: 'Interior square footage of heated living space.',
    driver4Name: 'Lat/Long (10.2%)',
    driver4Desc: 'Neighborhood micro-location and proximity.',
    predictionJustNow: 'Prediction evaluated just now',
    inferenceAt: 'Inference generated at',
    // Footer / Theme
    footerTitle: 'King County Real Estate ML Engine',
    footerAssignment: 'LMOPS Assignment',
    footerSubtext: 'Trained on 21,613 verified King County transactions \u2022 Built with FastAPI & XGBoost',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    // Language toggle
    switchToArabic: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
    switchToEnglish: 'English',
  },
  ar: {
    // Header
    brandBadge: '\u0646\u0645\u0648\u0630\u062c ML \u0643\u064a\u0646\u062c \u0643\u0627\u0648\u0646\u062a\u064a',
    appTitle: '\u062a\u0648\u0642\u0639 \u0633\u0639\u0631 \u0627\u0644\u0645\u0646\u0632\u0644',
    appSubtitle: '\u062a\u0642\u064a\u064a\u0645\u0627\u062a \u0633\u0648\u0642 \u0639\u0642\u0627\u0631\u064a \u062f\u0642\u064a\u0642\u0629 \u0641\u064a \u0648\u0644\u0627\u064a\u0629 \u0648\u0627\u0634\u0646\u0637\u0646 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 XGBoost \u0627\u0644\u0645\u062d\u0633\u0651\u064e\u0646 \u0628\u0645\u0639\u0627\u0645\u0644 R\u00b2 = 0.868.',
    swaggerDocs: '\u062a\u0648\u062b\u064a\u0642 Swagger API',
    checkingApi: '\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0642\u0642...',
    apiOnline: 'API \u0648\u0627\u0644\u0646\u0645\u0648\u0630\u062c \u064a\u0639\u0645\u0644\u0627\u0646',
    modelLoading: '\u062c\u0627\u0631\u064a \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0646\u0645\u0648\u0630\u062c...',
    apiDegraded: 'API \u0641\u064a \u062d\u0627\u0644\u0629 \u0636\u0639\u0641',
    backendOffline: '\u0627\u0644\u062e\u0627\u062f\u0645 \u063a\u064a\u0631 \u0645\u062a\u0627\u062d',
    // Presets
    quickStart: '\u0628\u062f\u0627\u064a\u0629 \u0633\u0631\u064a\u0639\u0629',
    loadPresets: '\u062a\u062d\u0645\u064a\u0644 \u0639\u064a\u0646\u0627\u062a \u0639\u0642\u0627\u0631\u064a\u0629:',
    presetSuburbanTitle: '\u0636\u0627\u062d\u064a\u0629 \u0633\u064a\u0627\u062a\u0644',
    presetSuburbanDesc: '3 \u063a\u0631\u0641\u060c 2.25 \u062d\u0645\u0627\u0645\u060c \u062f\u0631\u062c\u0629 7',
    presetLuxuryTitle: '\u0641\u0627\u062e\u0631 \u0639\u0644\u0649 \u0627\u0644\u0648\u0627\u062c\u0647\u0629 \u0627\u0644\u0645\u0627\u0626\u064a\u0629',
    presetLuxuryDesc: '4 \u063a\u0631\u0641\u060c 3.5 \u062d\u0645\u0627\u0645\u060c \u0648\u0627\u062c\u0647\u0629 \u0645\u0627\u0626\u064a\u0629\u060c \u062f\u0631\u062c\u0629 10',
    presetCottageTitle: '\u0645\u0646\u0632\u0644 \u0645\u0631\u064a\u062d',
    presetCottageDesc: '2 \u063a\u0631\u0641\u060c 1.0 \u062d\u0645\u0627\u0645\u060c \u062f\u0631\u062c\u0629 6',
    presetBellevueTitle: '\u0628\u064a\u0644\u0641\u064a\u0648 \u062a\u0646\u0641\u064a\u0630\u064a',
    presetBellevueDesc: '5 \u063a\u0631\u0641\u060c 4.0 \u062d\u0645\u0627\u0645\u060c \u062f\u0631\u062c\u0629 9',
    // Form
    formCardTitle: '\u062e\u0635\u0627\u0626\u0635 \u0627\u0644\u0639\u0642\u0627\u0631',
    formCardSubtitle: '\u0623\u062f\u062e\u0644 \u0645\u0648\u0627\u0635\u0641\u0627\u062a \u0627\u0644\u0645\u0646\u0632\u0644 \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u062a\u0642\u064a\u064a\u0645 \u0641\u0648\u0631\u064a.',
    groupCoreStructure: '\u0627\u0644\u0647\u064a\u0643\u0644 \u0627\u0644\u0623\u0633\u0627\u0633\u064a',
    groupAreaLiving: '\u0627\u0644\u0645\u0633\u0627\u062d\u0629 (\u0642\u062f\u0645 \u0645\u0631\u0628\u0639)',
    groupQualityRating: '\u0627\u0644\u062c\u0648\u062f\u0629 \u0648\u0627\u0644\u062a\u0642\u064a\u064a\u0645',
    groupLocation: '\u0627\u0644\u0645\u0648\u0642\u0639 \u0648\u0633\u0646\u0629 \u0627\u0644\u0628\u0646\u0627\u0621',
    labelBedrooms: '\u063a\u0631\u0641 \u0627\u0644\u0646\u0648\u0645',
    hintBedrooms: '\u0645\u062b\u0627\u0644: 3',
    labelBathrooms: '\u062f\u0648\u0631\u0627\u062a \u0627\u0644\u0645\u064a\u0627\u0647',
    hintBathrooms: '\u0645\u062b\u0627\u0644: 2.25',
    labelFloors: '\u0639\u062f\u062f \u0627\u0644\u0637\u0648\u0627\u0628\u0642',
    hintFloors: '\u0645\u062b\u0627\u0644: 2.0',
    labelSqftLiving: '\u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0645\u0639\u064a\u0634\u0629 (\u0642\u062f\u0645\u00b2)',
    hintSqftLiving: '\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u062f\u0627\u062e\u0644\u064a\u0629',
    labelSqftLot: '\u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0642\u0637\u0639\u0629 (\u0642\u062f\u0645\u00b2)',
    hintSqftLot: '\u0645\u0633\u0627\u062d\u0629 \u0623\u0631\u0636 \u0627\u0644\u0642\u0637\u0639\u0629',
    labelSqftAbove: '\u0641\u0648\u0642 \u0633\u0637\u062d \u0627\u0644\u0623\u0631\u0636 (\u0642\u062f\u0645\u00b2)',
    hintSqftAbove: '\u064a\u0633\u062a\u062b\u0646\u064a \u0627\u0644\u0642\u0628\u0648',
    labelSqftBasement: '\u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0642\u0628\u0648 (\u0642\u062f\u0645\u00b2)',
    hintSqftBasement: '0 \u0625\u0630\u0627 \u0644\u0645 \u064a\u0643\u0646 \u0647\u0646\u0627\u0643 \u0642\u0628\u0648',
    labelWaterfront: '\u0648\u0627\u062c\u0647\u0629 \u0645\u0627\u0626\u064a\u0629',
    optNo: '\u0644\u0627',
    optYes: '\u0646\u0639\u0645',
    hintWaterfront: '\u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0634\u0627\u0637\u0626',
    labelView: '\u062f\u0631\u062c\u0629 \u0627\u0644\u0645\u0646\u0638\u0631',
    view0: '0 - \u0644\u0627 \u064a\u0648\u062c\u062f',
    view1: '1 - \u0645\u0642\u0628\u0648\u0644',
    view2: '2 - \u0645\u062a\u0648\u0633\u0637',
    view3: '3 - \u062c\u064a\u062f',
    view4: '4 - \u0645\u0645\u062a\u0627\u0632',
    hintView: '\u0645\u0642\u064a\u0627\u0633 0-4',
    labelCondition: '\u0627\u0644\u062d\u0627\u0644\u0629',
    hintCondition: '\u0645\u0642\u064a\u0627\u0633 1-5',
    labelGrade: '\u062f\u0631\u062c\u0629 \u0627\u0644\u0628\u0646\u0627\u0621',
    hintGrade: '\u062f\u0631\u062c\u0629 \u0643\u064a\u0646\u062c \u0643\u0627\u0648\u0646\u062a\u064a 1-13 (\u0645\u062a\u0648\u0633\u0637 = 7)',
    labelYrBuilt: '\u0633\u0646\u0629 \u0627\u0644\u0628\u0646\u0627\u0621',
    hintYrBuilt: '\u0645\u062b\u0627\u0644: 1951',
    labelYrRenovated: '\u0633\u0646\u0629 \u0627\u0644\u062a\u062c\u062f\u064a\u062f',
    hintYrRenovated: '0 \u0625\u0630\u0627 \u0644\u0645 \u064a\u062c\u062f\u062f',
    labelZipcode: '\u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0628\u0631\u064a\u062f\u064a',
    hintZipcode: '\u0645\u062b\u0627\u0644: 98125',
    labelLat: '\u062e\u0637 \u0627\u0644\u0639\u0631\u0636',
    hintLat: '47.15 \u0625\u0644\u0649 47.78',
    labelLong: '\u062e\u0637 \u0627\u0644\u0637\u0648\u0644',
    hintLong: '-122.52 \u0625\u0644\u0649 -121.31',
    labelSqftLiving15: '\u0645\u062a\u0648\u0633\u0637 \u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u062c\u064a\u0631\u0627\u0646 (\u0642\u062f\u0645\u00b2)',
    hintSqftLiving15: '\u0623\u0642\u0631\u0628 15 \u0645\u0646\u0632\u0644',
    labelSqftLot15: '\u0645\u062a\u0648\u0633\u0637 \u0642\u0637\u0639\u0629 \u0627\u0644\u062c\u064a\u0631\u0627\u0646 (\u0642\u062f\u0645\u00b2)',
    hintSqftLot15: '\u0623\u0642\u0631\u0628 15 \u0642\u0637\u0639\u0629',
    btnCalculate: '\u0627\u062d\u0633\u0628 \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0645\u062a\u0648\u0642\u0639',
    btnCalculating: '\u062c\u0627\u0631\u064a \u0627\u0644\u062d\u0633\u0627\u0628...',
    btnReset: '\u0625\u0639\u0627\u062f\u0629 \u0636\u0628\u0637',
    // Results
    resultCardTitle: '\u0646\u062a\u064a\u062c\u0629 \u0627\u0644\u0646\u0645\u0648\u0630\u062c',
    resultCardSubtitle: '\u0646\u062a\u064a\u062c\u0629 \u062d\u064a\u0629 \u0645\u0646 FastAPI.',
    errorTitle: '\u062e\u0637\u0623 \u0641\u064a \u0627\u0644\u0637\u0644\u0628',
    errorMessage: '\u062a\u0639\u0630\u0651\u064e\u0631 \u0645\u0639\u0627\u0644\u062c\u0629 \u0637\u0644\u0628 \u0627\u0644\u062a\u0646\u0628\u0624.',
    predictionFailed: '\u0641\u0634\u0644 \u0627\u0644\u062a\u0646\u0628\u0624',
    networkError: '\u062e\u0637\u0623 \u0634\u0628\u0643\u0629: \u062a\u0639\u0630\u0651\u064e\u0631 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 API.',
    emptyStateTitle: '\u062c\u0627\u0647\u0632 \u0644\u0644\u062a\u0646\u0628\u0624',
    emptyStateDesc: '\u0627\u0636\u0628\u0637 \u0645\u0639\u0627\u0645\u0644\u0627\u062a \u0627\u0644\u0639\u0642\u0627\u0631 \u0623\u0648 \u0627\u062e\u062a\u0631 \u0633\u064a\u0646\u0627\u0631\u064a\u0648\u064b\u0627\u060c \u062b\u0645 \u0627\u0636\u063a\u0637 "\u0627\u062d\u0633\u0628 \u0627\u0644\u0633\u0639\u0631".',
    estimatedMarketValue: '\u0627\u0644\u0642\u064a\u0645\u0629 \u0627\u0644\u0633\u0648\u0642\u064a\u0629 \u0627\u0644\u0645\u062a\u0648\u0642\u0639\u0629',
    derivedFeaturesTitle: '\u0627\u0644\u0645\u064a\u0632\u0627\u062a \u0627\u0644\u0645\u062d\u0633\u0648\u0628\u0629 \u0648\u0623\u0628\u0631\u0632 \u0627\u0644\u0646\u0642\u0627\u0637',
    metricHouseAge: '\u0639\u0645\u0631 \u0627\u0644\u0645\u0646\u0632\u0644 (\u0623\u0633\u0627\u0633 2015)',
    metricTotalRooms: '\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u063a\u0631\u0641',
    metricCountyGrade: '\u062f\u0631\u062c\u0629 \u0627\u0644\u0645\u0642\u0627\u0637\u0639\u0629',
    metricWaterfrontAccess: '\u0648\u0627\u062c\u0647\u0629 \u0645\u0627\u0626\u064a\u0629',
    metricYears: '\u0633\u0646\u0629',
    metricRooms: '\u063a\u0631\u0641\u0629',
    metricYes: '\u0646\u0639\u0645',
    metricNo: '\u0644\u0627',
    topDriversTitle: '\u0623\u0628\u0631\u0632 \u0639\u0648\u0627\u0645\u0644 \u0627\u0644\u062a\u0642\u064a\u064a\u0645',
    topDriversSubtext: '\u0645\u0628\u0646\u064a\u0629 \u0639\u0644\u0649 XGBoost Feature Importance',
    driver1Name: '\u0627\u0644\u062f\u0631\u062c\u0629 (27.6%)',
    driver1Desc: '\u062c\u0648\u062f\u0629 \u0627\u0644\u0628\u0646\u0627\u0621 \u0641\u064a \u0643\u064a\u0646\u062c \u0643\u0627\u0648\u0646\u062a\u064a.',
    driver2Name: '\u0627\u0644\u0648\u0627\u062c\u0647\u0629 \u0627\u0644\u0645\u0627\u0626\u064a\u0629 (22.2%)',
    driver2Desc: '\u0648\u0635\u0648\u0644 \u0641\u0627\u062e\u0631 \u0644\u0634\u0648\u0627\u0637\u0626 \u0627\u0644\u0645\u064a\u0627\u0647.',
    driver3Name: '\u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0645\u0639\u064a\u0634\u0629 (16.7%)',
    driver3Desc: '\u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0637\u0648\u0627\u0628\u0642 \u0627\u0644\u062f\u0627\u062e\u0644\u064a\u0629 \u0627\u0644\u0645\u062f\u0641\u0623\u0629.',
    driver4Name: '\u062e\u0637\u0627 \u0627\u0644\u0639\u0631\u0636/\u0627\u0644\u0637\u0648\u0644 (10.2%)',
    driver4Desc: '\u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u062f\u0642\u064a\u0642 \u0648\u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0627\u0644\u0628\u0646\u064a\u0629 \u0627\u0644\u062a\u062d\u062a\u064a\u0629.',
    predictionJustNow: '\u062c\u0631\u0649 \u062a\u0642\u064a\u064a\u0645 \u0627\u0644\u062a\u0646\u0628\u0624 \u0644\u0644\u062a\u0648',
    inferenceAt: '\u062a\u0645 \u0627\u0644\u0627\u0633\u062a\u062f\u0644\u0627\u0644 \u0641\u064a',
    // Footer / Theme
    footerTitle: '\u0645\u062d\u0631\u0643 ML \u0644\u0639\u0642\u0627\u0631\u0627\u062a \u0643\u064a\u0646\u062c \u0643\u0627\u0648\u0646\u062a\u064a',
    footerAssignment: '\u0645\u0647\u0645\u0629 LMOPS',
    footerSubtext: '\u0645\u062f\u0631\u0628 \u0639\u0644\u0649 21,613 \u0635\u0641\u0642\u0629 \u0639\u0642\u0627\u0631\u064a\u0629 \u2022 \u0645\u0628\u0646\u064a \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 FastAPI & XGBoost',
    darkMode: '\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062f\u0627\u0643\u0646',
    lightMode: '\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0641\u0627\u062a\u062d',
    // Language toggle
    switchToArabic: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
    switchToEnglish: 'English',
  }
};

// ---------------------------------------------------------------------------
// Storage Keys
// ---------------------------------------------------------------------------
const THEME_KEY = 'kc_house_theme';
const LANG_KEY  = 'kc_house_lang';

// Base URL for API calls (relative to avoid CORS issues)
const API_BASE = window.API_BASE_URL || '';

// ---------------------------------------------------------------------------
// Bootstrap on DOM ready
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initLangEngine();
  initPresets();
  initFormHandler();
  checkApiHealth();
});

/* ==========================================================================
   THEME ENGINE (Dark / Light Mode)
   ========================================================================== */
function initThemeEngine() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const currentThemeLabel = document.getElementById('currentThemeLabel');

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const lang = document.documentElement.getAttribute('lang') || 'en';
    if (currentThemeLabel) {
      currentThemeLabel.textContent = theme === 'dark'
        ? TRANSLATIONS[lang].darkMode
        : TRANSLATIONS[lang].lightMode;
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

/* ==========================================================================
   LANGUAGE ENGINE (English / Arabic with RTL/LTR)
   ========================================================================== */
function initLangEngine() {
  const langToggleBtn = document.getElementById('langToggleBtn');
  const langText = document.getElementById('langText');

  function getPreferredLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
    return 'en';
  }

  function applyLang(lang) {
    const html = document.documentElement;
    const isAr = lang === 'ar';

    // 1. Set HTML lang + dir attributes for RTL/LTR
    html.setAttribute('lang', lang);
    html.setAttribute('dir', isAr ? 'rtl' : 'ltr');

    // 2. Toggle Arabic font class
    if (isAr) {
      html.classList.add('lang-ar');
    } else {
      html.classList.remove('lang-ar');
    }

    // 3. Update toggle button label to show the OTHER language
    if (langText) {
      langText.textContent = isAr
        ? TRANSLATIONS.ar.switchToEnglish
        : TRANSLATIONS.en.switchToArabic;
    }

    // 4. Translate all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
        // Special handling: don't overwrite nested elements that have their own i18n
        if (el.children.length === 0 || el.tagName === 'STRONG' || el.tagName === 'SPAN' || el.tagName === 'SMALL' || el.tagName === 'OPTION') {
          el.textContent = TRANSLATIONS[lang][key];
        } else {
          // For elements that contain children (e.g. <p> with <strong>), skip to avoid overwriting
          // Only update textContent if element has no child elements with data-i18n
          const hasI18nChildren = el.querySelector('[data-i18n]');
          if (!hasI18nChildren) {
            el.textContent = TRANSLATIONS[lang][key];
          }
        }
      }
    });

    // 5. Re-apply theme label (it uses translated strings)
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const themeLabel = document.getElementById('currentThemeLabel');
    if (themeLabel) {
      themeLabel.textContent = theme === 'dark'
        ? TRANSLATIONS[lang].darkMode
        : TRANSLATIONS[lang].lightMode;
    }

    // 6. Translate button text states
    const btnText = document.getElementById('btnText');
    if (btnText && !document.getElementById('submitBtn').disabled) {
      btnText.textContent = TRANSLATIONS[lang].btnCalculate;
    }

    // 7. Persist preference
    localStorage.setItem(LANG_KEY, lang);
  }

  const initialLang = getPreferredLang();
  applyLang(initialLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('lang') || 'en';
      applyLang(current === 'en' ? 'ar' : 'en');
    });
  }
}

/* ==========================================================================
   Preset Handler
   ========================================================================== */
const PRESETS = {
  suburban: {
    bedrooms: 3, bathrooms: 2.25, sqft_living: 2570, sqft_lot: 7242,
    floors: 2.0, waterfront: 0, view: 0, condition: 3, grade: 7,
    sqft_above: 2170, sqft_basement: 400, yr_built: 1951, yr_renovated: 1991,
    zipcode: 98125, lat: 47.7210, long: -122.3190, sqft_living15: 1690, sqft_lot15: 7639
  },
  luxury: {
    bedrooms: 4, bathrooms: 3.5, sqft_living: 4200, sqft_lot: 15400,
    floors: 2.0, waterfront: 1, view: 4, condition: 4, grade: 10,
    sqft_above: 3500, sqft_basement: 700, yr_built: 2001, yr_renovated: 0,
    zipcode: 98033, lat: 47.6850, long: -122.2100, sqft_living15: 3800, sqft_lot15: 14000
  },
  cottage: {
    bedrooms: 2, bathrooms: 1.0, sqft_living: 770, sqft_lot: 10000,
    floors: 1.0, waterfront: 0, view: 0, condition: 3, grade: 6,
    sqft_above: 770, sqft_basement: 0, yr_built: 1933, yr_renovated: 0,
    zipcode: 98028, lat: 47.7379, long: -122.2330, sqft_living15: 2720, sqft_lot15: 8062
  },
  bellevue: {
    bedrooms: 5, bathrooms: 4.0, sqft_living: 4600, sqft_lot: 11200,
    floors: 2.0, waterfront: 0, view: 2, condition: 4, grade: 9,
    sqft_above: 3600, sqft_basement: 1000, yr_built: 1998, yr_renovated: 2012,
    zipcode: 98004, lat: 47.6180, long: -122.2020, sqft_living15: 4100, sqft_lot15: 10500
  }
};

function initPresets() {
  const presetButtons = document.querySelectorAll('.preset-btn');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.dataset.preset;
      if (PRESETS[presetKey]) fillForm(PRESETS[presetKey]);
    });
  });
  fillForm(PRESETS.suburban);
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('presetSuburban') && document.getElementById('presetSuburban').classList.add('active');
      fillForm(PRESETS.suburban);
      hideError();
    });
  }
}

function fillForm(data) {
  Object.keys(data).forEach(key => {
    const field = document.getElementById(key);
    if (field) field.value = data[key];
  });
}

/* ==========================================================================
   Form Submission & API Integration (POST /predict)
   ========================================================================== */
function initFormHandler() {
  const form = document.getElementById('predictionForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnIcon = document.getElementById('btnIcon');
  const btnText = document.getElementById('btnText');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitBtn.disabled) return;

    hideError();
    setLoadingState(true);

    try {
      const payload = extractFormData(form);

      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorDetail = `Server returned status ${response.status} (${response.statusText})`;
        try {
          const errJson = await response.json();
          if (errJson.detail) {
            errorDetail = Array.isArray(errJson.detail)
              ? errJson.detail.map(d => `${d.loc ? d.loc.join('.') + ': ' : ''}${d.msg}`).join(', ')
              : String(errJson.detail);
          }
        } catch (_) {}
        throw new Error(errorDetail);
      }

      const result = await response.json();
      displayPrediction(result);

    } catch (err) {
      console.error('Prediction request error:', err);
      const lang = document.documentElement.getAttribute('lang') || 'en';
      const t = TRANSLATIONS[lang];
      showError(
        t.predictionFailed,
        err.message.includes('Failed to fetch') ? t.networkError : err.message
      );
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(isLoading) {
    const lang = document.documentElement.getAttribute('lang') || 'en';
    const t = TRANSLATIONS[lang];
    submitBtn.disabled = isLoading;
    if (isLoading) {
      btnSpinner.style.display = 'inline-block';
      btnIcon.style.display = 'none';
      btnText.textContent = t.btnCalculating;
    } else {
      btnSpinner.style.display = 'none';
      btnIcon.style.display = 'inline';
      btnText.textContent = t.btnCalculate;
    }
  }
}

function extractFormData(form) {
  const formData = new FormData(form);
  return {
    bedrooms: parseInt(formData.get('bedrooms'), 10),
    bathrooms: parseFloat(formData.get('bathrooms')),
    sqft_living: parseInt(formData.get('sqft_living'), 10),
    sqft_lot: parseInt(formData.get('sqft_lot'), 10),
    floors: parseFloat(formData.get('floors')),
    waterfront: parseInt(formData.get('waterfront'), 10),
    view: parseInt(formData.get('view'), 10),
    condition: parseInt(formData.get('condition'), 10),
    grade: parseInt(formData.get('grade'), 10),
    sqft_above: parseInt(formData.get('sqft_above'), 10),
    sqft_basement: parseInt(formData.get('sqft_basement'), 10),
    yr_built: parseInt(formData.get('yr_built'), 10),
    yr_renovated: parseInt(formData.get('yr_renovated'), 10),
    zipcode: parseInt(formData.get('zipcode'), 10),
    lat: parseFloat(formData.get('lat')),
    long: parseFloat(formData.get('long')),
    sqft_living15: parseInt(formData.get('sqft_living15'), 10),
    sqft_lot15: parseInt(formData.get('sqft_lot15'), 10)
  };
}

/* ==========================================================================
   Display Prediction Results
   ========================================================================== */
function displayPrediction(result) {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const t = TRANSLATIONS[lang];

  const emptyState = document.getElementById('emptyState');
  const resultDetails = document.getElementById('resultDetails');
  const displayPrice = document.getElementById('displayPrice');
  const displayModelName = document.getElementById('displayModelName');
  const metricAge = document.getElementById('metricAge');
  const metricRooms = document.getElementById('metricRooms');
  const metricGrade = document.getElementById('metricGrade');
  const metricWaterfront = document.getElementById('metricWaterfront');
  const timestampMeta = document.getElementById('predictionTimestamp');

  emptyState.style.display = 'none';
  resultDetails.style.display = 'block';

  animateValue(displayPrice, 0, result.predicted_price, 800);

  if (displayModelName) {
    displayModelName.textContent = result.model_name || 'XGBoost Regressor (Pipeline)';
  }

  if (result.input_summary) {
    const s = result.input_summary;
    if (metricAge) metricAge.textContent = `${s.house_age} ${t.metricYears}`;
    if (metricRooms) metricRooms.textContent = `${s.total_rooms_count} ${t.metricRooms}`;
    if (metricGrade) metricGrade.textContent = `Grade ${s.grade}/13`;
    if (metricWaterfront) metricWaterfront.textContent = s.waterfront ? t.metricYes : t.metricNo;
  }

  if (timestampMeta) {
    const now = new Date();
    timestampMeta.textContent = `${t.inferenceAt} ${now.toLocaleTimeString()}`;
  }

  if (window.innerWidth <= 980) {
    resultDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function animateValue(elem, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    elem.textContent = current.toLocaleString('en-US');
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      elem.textContent = Number(end).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };
  window.requestAnimationFrame(step);
}

/* ==========================================================================
   Error Banner Handling
   ========================================================================== */
function showError(title, message) {
  const banner = document.getElementById('errorBanner');
  const titleElem = document.getElementById('errorTitle');
  const msgElem = document.getElementById('errorMessage');
  if (banner && titleElem && msgElem) {
    titleElem.textContent = title;
    msgElem.textContent = message;
    banner.style.display = 'flex';
  }
}

function hideError() {
  const banner = document.getElementById('errorBanner');
  if (banner) banner.style.display = 'none';
}

/* ==========================================================================
   Health Check
   ========================================================================== */
async function checkApiHealth() {
  const circle = document.getElementById('healthCircle');
  const label = document.getElementById('healthLabel');

  try {
    const res = await fetch(`${API_BASE}/health`);
    const lang = document.documentElement.getAttribute('lang') || 'en';
    const t = TRANSLATIONS[lang];
    if (res.ok) {
      const data = await res.json();
      if (data.model_loaded) {
        circle.className = 'status-circle healthy';
        label.textContent = t.apiOnline;
      } else {
        circle.className = 'status-circle';
        label.textContent = t.modelLoading;
      }
    } else {
      circle.className = 'status-circle error';
      label.textContent = TRANSLATIONS[document.documentElement.getAttribute('lang') || 'en'].apiDegraded;
    }
  } catch (_) {
    circle.className = 'status-circle error';
    label.textContent = TRANSLATIONS[document.documentElement.getAttribute('lang') || 'en'].backendOffline;
  }
}
