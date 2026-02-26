import React from 'react';
import type { Language } from '../types';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
    </svg>
);

const CrownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

interface IntroductionPageProps {
    onBack: () => void;
    lang: Language;
    setLang: (l: Language) => void;
    colorLookback: number;
    setColorLookback: (val: number) => void;
    seriesLookback: number;
    setSeriesLookback: (val: number) => void;
}

const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
];

const content = {
    en: {
        manual: "Master Intelligence Manual", langLabel: "Select Language",
        setup: "System Setup", colorDepth: "Color Lookback", seriesDepth: "Series Lookback",
        setupIntro: "Configure analysis engine depth. Determines how many history spins are used for trend prediction.",
        proTitle: "PRO VERSION UPGRADE", proBtn: "Unlock Pro Functions",
        proIntro: "Gain professional access to the VIP Intelligence suite and deep tracking tools.",
        proB1: "Full Series & Sector Roadmap Tracking",
        proB2: "Full Final Number Transition & Times History Matrix",
        proB3: "Advanced Performance Metrics & Real-time Hit Ratio",
        s1Title: "The Prediction Core", s1Desc: "Uses a Consensus Model looking for multi-variable overlaps.",
        s1P1T: "1. Sequence Recognition", s1P1D: "Scans history for repeating pairs that lead to specific outcomes.",
        s1P2T: "2. Sector Clustering", s1P2D: "Identifies wheel bias using French regions and dealer rhythms.",
        s2Title: "VIP Intelligence Tools", s2Desc: "Visual data layers revealing deep trends.",
        s2P1T: "Final Digit Frequency Matrix", s2P1D: "Tracks transition probability. Example: If 13 (Final 3) hits, row 3 shows likely next digits.",
        s2P2T: "Sector Roadway (Heatmap)", s2P2D: "Visualizes Voisins, Orphelins, and Tiers sectors across history.",
        s3Title: "Execution Strategy", btn: "Initialize System"
    },
    zh: {
        manual: "大师智能手册", langLabel: "选择语言",
        setup: "系统设置", colorDepth: "颜色深度", seriesDepth: "分区深度",
        setupIntro: "配置分析引擎深度。决定使用多少历史数据来预测趋势。",
        proTitle: "升级 PRO 专业版", proBtn: "开启专业功能",
        proIntro: "获取机构级 VIP 核心情报套件访问权限。",
        proB1: "全方位扇区与分区路单追踪 (Series Tracking)",
        proB2: "完整尾数转换与出现次数历史矩阵 (Final Number Matrix)",
        proB3: "历史绩效统计与实时命中率分析",
        s1Title: "核心预测引擎", s1Desc: "使用多变量重叠的共识模型。",
        s1P1T: "1. 序列识别", s1P1D: "扫描历史记录，寻找导致特定结果的重复号码对。",
        s1P2T: "2. 扇区聚类", s1P2D: "利用法式分区和荷官节奏识别轮盘偏差。",
        s2Title: "VIP 智能工具", s2Desc: "揭示深层趋势的可视化数据层。",
        s2P1T: "尾数频率矩阵", s2P1D: "追踪转换概率。例如：如果命中13（尾数3），第3行显示后续可能的尾数。",
        s2P2T: "扇区热力图", s2P2D: "可视化历史记录中的零区、孤注和三区分布。",
        s3Title: "执行策略", btn: "初始化系统"
    },
    ja: {
        manual: "マスター・インテリジェンス・マニュアル", langLabel: "言語を選択",
        setup: "システム設定", colorDepth: "カラー深度", seriesDepth: "セクター深度",
        setupIntro: "分析エンジンの深度を設定します。トレンド予測に使用する履歴数を決定します。",
        proTitle: "PRO版へのアップグレード", proBtn: "プロ機能をアンロック",
        proIntro: "プロ仕様のVIPインテリジェンススイートをフル活用。",
        proB1: "フルセクター＆シリーズロードマップ・トラッキング",
        proB2: "詳細な下一桁遷移＆出現回数履歴マトリックス",
        proB3: "パフォーマンス分析とリアルタイム的中率",
        s1Title: "予測コアエンジン", s1Desc: "多変量オーバーラップを探すコンセンサスモデルを使用。",
        s1P1T: "1. シーケンス認識", s1P1D: "特定の結果につながる繰り返しのペアをスキャンします。",
        s1P2T: "2. セクタークラスタリング", s1P2D: "フレンチセクターとディーラーのリズムから物理的バイアスを特定。",
        s2Title: "VIPインテリジェンスツール", s2Desc: "深層トレンドを明らかにするビジュアルデータ。",
        s2P1T: "下一桁頻度マトリックス", s2P1D: "遷移確率を追跡。例：13（下一桁3）が出た場合、行3が次に続く可能性の高い数字を表示。",
        s2P2T: "セクターロードウェイ", s2P2D: "Voisins、Orphelins、Tiersセクターの履歴を可視化します。",
        s3Title: "実行戦略", btn: "システム初期化"
    },
    es: {
        manual: "Manual de Inteligencia Maestra", langLabel: "Seleccionar Idioma",
        setup: "Configuración", colorDepth: "Prof. Color", seriesDepth: "Prof. Serie",
        setupIntro: "Configura la profundidad del motor de análisis. Determina cuántos giros se usan para la tendencia.",
        proTitle: "VERSIÓN PRO", proBtn: "Desbloquear Funciones Pro",
        proIntro: "Acceso de nivel profesional a la suite de Inteligencia VIP.",
        proB1: "Seguimiento Completo de Series y Sectores",
        proB2: "Matriz de Transición de Dígito Final y Historial de Frecuencia",
        proB3: "Métricas de Rendimiento y Ratios de Acierto en Tiempo Real",
        s1Title: "Núcleo de Predicción", s1Desc: "Usa un modelo de consenso buscando solapamientos multivariables.",
        s1P1T: "1. Reconocimiento de Secuencias", s1P1D: "Escanea pares repetidos que conducen a resultados específicos.",
        s1P2T: "2. Agrupación por Sectores", s1P2D: "Identifica sesgos usando regiones francesas y ritmos del crupier.",
        s2Title: "Herramientas de Inteligencia VIP", s2Desc: "Capas de datos visuales que reveal tendencias profundas.",
        s2P1T: "Matriz de Frecuencia de Dígito Final", s2P1D: "Rastrea probabilidad de transición. Ej: Si sale 13 (Final 3), la fila 3 muestra posibles finales.",
        s2P2T: "Mapa de Calor del Sector", s2P2D: "Visualiza sectores Voisins, Orphelins y Tiers en el historial.",
        s3Title: "Estrategia de Ejecución", btn: "Inicializar Sistema"
    },
    ko: {
        manual: "마스터 인텔리전스 매뉴얼", langLabel: "언어 선택",
        setup: "시스템 설정", colorDepth: "색상 깊이", seriesDepth: "구역 깊이",
        setupIntro: "분석 엔진 깊이를 설정합니다. 트렌드 예측에 사용할 히스토리 수를 결정합니다.",
        proTitle: "PRO 버전 업그레이드", proBtn: "프로 기능 잠금 해제",
        proIntro: "전문가용 VIP 인텔리전스 스위트 및 심층 트래킹 도구 액세스.",
        proB1: "전체 구역 및 섹터 로드맵 트래킹 (Full Series)",
        proB2: "전체 끝수 전환 및 횟수 히스토리 매트릭스 (Full Final Number)",
        proB3: "고급 성능 지표 및 실시간 적중률 분석",
        s1Title: "예측 핵심 엔진", s1Desc: "다변수 중첩을 찾는 합의 모델을 사용합니다.",
        s1P1T: "1. 시퀀스 인식", s1P1D: "특정 결과로 이어지는 반복되는 번호 쌍을 스캔합니다.",
        s1P2T: "2. 섹터 클러스터링", s1P2D: "프랑스 구역과 딜러 리듬을 사용하여 휠 바이어스를 식별합니다.",
        s2Title: "VIP 인텔리전스 도구", s2Desc: "심층 트렌드를 드러내는 시각적 데이터 레이어.",
        s2P1T: "끝수 빈도 매트릭스", s2P1D: "전환 확률을 추적합니다. 예: 13(끝수 3) 적중 시, 3번 행이 다음 가능성 있는 끝수를 표시.",
        s2P2T: "섹터 로드맵 (히트맵)", s2P2D: "히스토리에서 Voisins, Orphelins, Tiers 섹터를 시각화합니다.",
        s3Title: "실행 전략", btn: "시스템 초기화"
    }
};

export const IntroductionPage: React.FC<IntroductionPageProps> = ({ 
    onBack, lang, setLang, colorLookback, setColorLookback, seriesLookback, setSeriesLookback 
}) => {
    const t = content[lang] || content['en'];
    const colorOptions = [2, 3, 5, 8];
    const seriesOptions = [3, 4, 5, 6, 8];

    const handleUnlockPro = () => {
        if (('vibrate' in navigator)) navigator.vibrate([30, 10, 30]);
        alert("Pro features are already unlocked for this session.");
    };

    return (
        <div className="animate-fade-in pb-20 max-w-3xl mx-auto px-1">
            <div className="flex items-center mb-6 mt-2 sticky top-0 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-md z-10 py-2">
                <button onClick={onBack} className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all mr-4 border border-gray-100 dark:border-gray-700" aria-label="Back">
                    <BackIcon />
                </button>
                <h2 className="text-2xl font-black" style={{fontFamily: "'Playfair Display', serif"}}>
                    {t.manual.split(' ')[0]} <span className="text-gold">{t.manual.split(' ').slice(1).join(' ')}</span>
                </h2>
            </div>

            <div className="space-y-4">
                {/* Pro Upgrade Section */}
                <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-5 rounded-3xl shadow-2xl border border-gold/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                        <CrownIcon />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xs font-black text-gold uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                           <CrownIcon /> {t.proTitle}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                            {t.proIntro}
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-start text-[10px] font-black text-gray-200 uppercase tracking-tighter">
                                <CheckIcon /> {t.proB1}
                            </li>
                            <li className="flex items-start text-[10px] font-black text-gray-200 uppercase tracking-tighter">
                                <CheckIcon /> {t.proB2}
                            </li>
                            <li className="flex items-start text-[10px] font-black text-gray-200 uppercase tracking-tighter">
                                <CheckIcon /> {t.proB3}
                            </li>
                        </ul>
                        <button 
                            onClick={handleUnlockPro}
                            className="w-full bg-gold hover:bg-yellow-500 text-black font-black py-3 rounded-2xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            {t.proBtn}
                        </button>
                    </div>
                </section>

                {/* Combined Settings Section */}
                <section className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Language Picker */}
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t.langLabel}</h3>
                            <div className="grid grid-cols-5 gap-1.5">
                                {languages.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => { if (('vibrate' in navigator)) navigator.vibrate(10); setLang(l.code); }}
                                        className={`flex flex-col items-center justify-center p-1.5 rounded-xl border-2 transition-all active:scale-95 ${lang === l.code ? 'border-gold bg-gold/5 shadow-md' : 'border-gray-100 dark:border-gray-700 hover:border-gold/30'}`}
                                    >
                                        <span className="text-xl mb-0.5">{l.flag}</span>
                                        <span className={`text-[8px] font-black uppercase ${lang === l.code ? 'text-gold' : 'text-gray-400'}`}>{l.code}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* System Setup */}
                        <div>
                            <h3 className="text-[10px] font-black text-gold uppercase tracking-widest mb-3">{t.setup}</h3>
                            <div className="space-y-3">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-tight mb-2">
                                    {t.setupIntro}
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-[8px] font-black text-gray-500 uppercase block mb-1">{t.colorDepth}</span>
                                        <div className="flex gap-1">
                                            {colorOptions.map(val => (
                                                <button 
                                                    key={val} 
                                                    onClick={() => setColorLookback(val)}
                                                    className={`flex-1 py-1 rounded-lg border font-black text-[9px] transition-all ${colorLookback === val ? 'border-gold bg-gold text-black' : 'border-gray-100 dark:border-gray-700 text-gray-400'}`}
                                                >
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[8px] font-black text-gray-500 uppercase block mb-1">{t.seriesDepth}</span>
                                        <div className="flex gap-1">
                                            {seriesOptions.map(val => (
                                                <button 
                                                    key={val} 
                                                    onClick={() => setSeriesLookback(val)}
                                                    className={`flex-1 py-1 rounded-lg border font-black text-[9px] transition-all ${seriesLookback === val ? 'border-gold bg-gold text-black' : 'border-gray-100 dark:border-gray-700 text-gray-400'}`}
                                                >
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-10 h-10 rounded-2xl bg-gold flex items-center justify-center font-black text-black text-xl shadow-lg">01</div>
                        <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest">{t.s1Title}</h3>
                    </div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider leading-relaxed mb-6">{t.s1Desc}</p>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/30">
                            <span className="text-[10px] font-black text-roulette-red block mb-2 tracking-widest uppercase">{t.s1P1T}</span>
                            <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300 leading-snug">{t.s1P1D}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/30">
                            <span className="text-[10px] font-black text-roulette-green block mb-2 tracking-widest uppercase">{t.s1P2T}</span>
                            <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300 leading-snug">{t.s1P2D}</p>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-10 h-10 rounded-2xl bg-black border border-gold flex items-center justify-center font-black text-gold text-xl shadow-lg">02</div>
                        <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest">{t.s2Title}</h3>
                    </div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">{t.s2Desc}</p>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-black text-gold uppercase tracking-widest mb-2">{t.s2P1T}</h4>
                            <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/30 leading-relaxed">{t.s2P1D}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-gold uppercase tracking-widest mb-2">{t.s2P2T}</h4>
                            <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/30 leading-relaxed">{t.s2P2D}</p>
                        </div>
                    </div>
                </section>

                <div className="p-6 text-center">
                    <button onClick={onBack} className="w-full bg-gold hover:bg-yellow-500 text-black font-black py-4 rounded-2xl transition-all active:scale-95 shadow-xl uppercase text-xs tracking-[0.2em]">
                        {t.btn}
                    </button>
                </div>
            </div>
        </div>
    );
};