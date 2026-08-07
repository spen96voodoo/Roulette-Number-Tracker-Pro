import React, { useState } from 'react';
import type { Language, FiveCriteriaDepths } from '../types';
import { VipActivationCard } from './VipActivationCard';

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

interface SetupPageProps {
  onBack: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  fiveDepths: FiveCriteriaDepths;
  setFiveDepths: React.Dispatch<React.SetStateAction<FiveCriteriaDepths>>;
  onClearSession?: () => void;
  isPro?: boolean;
  onActivated?: () => void;
}

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
];

const labels = {
  en: {
    setupTitle: 'System Set Up',
    langLabel: 'System Language',
    setupIntro: 'Configure analysis engine lookback spin depth for each of the 5 prediction criteria.',
    colorDepth: '🎨 Colour Prediction Depth',
    finalDepth: '🔢 Final Digit Prediction Depth',
    seriesDepth: '🧭 Series Prediction Depth',
    sectorsDepth: '🎯 Sectors Prediction Depth',
    pocketsDepth: '📏 Pockets Step Depth',
    spins: 'Spins',
    resetAll: 'Reset All to 5 Spins',
    defaultNotice: 'Default lookback depth is set to 5 spins for optimal pattern recognition.',
    reloadTitle: 'App Reload & Reset',
    currentVersion: 'Current Version: v2.5.0 Pro All-in-One',
    reloadNotice: 'Reload or restart the application anytime. Choose to keep your current spin history and settings intact, or clear all data for a fresh restart.',
    reloadBtn: 'Reload / Restart Application',
    reloadModalTitle: 'Reload Application',
    reloadModalMsg: 'Would you like to keep your current spin history and settings, or clear all session data before reloading?',
    keepDataBtn: '✅ Keep Data & Reload',
    clearDataBtn: '🗑️ Clear All Data & Reload',
    cancelBtn: 'Cancel',
    disclaimerTitle: 'DISCLAIMER',
    lastUpdated: 'Last Updated: Aug 2026',
    d1Title: '1. Purely Statistical & Analytical Tool',
    d1Text: 'This application ("Roulette Tracker") is intended solely for data recording, statistical analysis, and entertainment reference purposes. All charts, trends, and numerical values presented are historical data and do not represent or guarantee any future outcomes.',
    d2Title: '2. No Advice Provided',
    d2Text: 'This app does not provide any financial, legal, or decision-making advice. Any actions you take based on the data from this app are your own personal choices and are not affiliated with or endorsed by this app.',
    d3Title: '3. No Guarantee of Data Accuracy',
    d3Text: 'We strive to ensure the accuracy of data records, but we cannot guarantee that the data is 100% accurate, complete, or real-time. Human entry errors, system delays, or technical issues may affect statistical results.',
    d4Title: '4. Data for Reference Only',
    d4Text: 'All analytical results provided by this app are for reference only and should not be relied upon as a basis for any decisions or guarantees. Users are responsible for exercising their own judgment regarding the reliability of the data.',
    d5Title: '5. User Responsibility',
    d5Text: 'By using this app, you acknowledge and agree that all analytical outputs are purely statistical products. You assume full responsibility for any decisions or actions you take based on the data provided.',
    d6Title: '6. Third-Party Links',
    d6Text: 'If this app contains links to third-party websites, we assume no responsibility for their content, operations, or security.',
    d7Title: '7. Limitation of Liability',
    d7Text: 'To the fullest extent permitted by law, the developers and affiliates of this app shall not be held liable for any direct or indirect losses (including but not limited to data loss, business interruption, or any other damages) arising from the use or inability to use this app, or reliance on its data.',
    d8Title: '8. Changes to This Disclaimer',
    d8Text: 'We reserve the right to update this disclaimer at any time. Any changes will be announced within the app.',
  },
  zh: {
    setupTitle: '系统设置',
    langLabel: '系统语言',
    setupIntro: '针对5大预测标准分别配置分析引擎的历史旋转深度。',
    colorDepth: '🎨 颜色预测深度',
    finalDepth: '🔢 尾数预测深度',
    seriesDepth: '🧭 分区预测深度',
    sectorsDepth: '🎯 扇区预测深度',
    pocketsDepth: '📏 口袋步距深度',
    spins: '转',
    resetAll: '重置全为5转',
    defaultNotice: '默认深度设置为5转，可获得最佳模式识别与预测精准度。',
    reloadTitle: '应用重新载入与重置',
    currentVersion: '当前版本：v2.5.0 Pro All-in-One',
    reloadNotice: '随时重新载入或重启应用。您可以选择保留当前所有历史旋转记录与设置，或清空数据全新重启。',
    reloadBtn: '重新载入 / 重启应用',
    reloadModalTitle: '重新载入应用',
    reloadModalMsg: '您希望在重新载入时保留当前的旋转历史记录与设置，还是清空所有数据重新开始？',
    keepDataBtn: '✅ 保留数据并重新载入',
    clearDataBtn: '🗑️ 清空数据并重新载入',
    cancelBtn: '取消',
    disclaimerTitle: '免责声明',
    lastUpdated: '最后更新：2026年8月',
    d1Title: '1. 纯粹的统计与分析工具',
    d1Text: '本应用（“轮盘走势追踪”）仅用于数据记录、统计分析与娱乐参考。所呈现的所有图表、趋势与数值均为历史数据，不代表亦不保证未来的任何结果。',
    d2Title: '2. 不提供任何建议',
    d2Text: '本应用不提供任何财务、法律或决策建议。您基于本应用数据采取的任何行动均属于您个人的独立选择，与本应用无关。',
    d3Title: '3. 不保证数据绝对准确',
    d3Text: '我们力求确保数据记录的准确性，但无法保证数据百分之百准确、完整或实时。人工录入错误、系统延时或技术故障均可能影响统计结果。',
    d4Title: '4. 数据仅供参考',
    d4Text: '本应用提供的所有分析结果仅供参考，不应作为任何决策或承诺的依据。使用者需自行对数据的可靠性进行判断。',
    d5Title: '5. 用户自行承担责任',
    d5Text: '使用本应用即表示您知悉并同意所有分析输出纯属统计产物。您对基于所提供数据作出的任何决定或行为承担全部责任。',
    d6Title: '6. 第三方链接',
    d6Text: '若本应用包含指向第三方网站的链接，我们不对其内容、运营或安全性承担任何责任。',
    d7Title: '7. 责任限制',
    d7Text: '在法律允许的最大范围内，本应用的开发者及关联方不对因使用或无法使用本应用、或依赖其数据而导致的任何直接或间接损失（包括但不限于数据丢失、业务中断或其他损害）承担责任。',
    d8Title: '8. 免责声明的变更',
    d8Text: '我们保留随时更新本免责声明的权利。任何变更将在应用内公布。',
  },
  ja: {
    setupTitle: 'システム設定',
    langLabel: 'システム言語',
    setupIntro: '5つの予測基準ごとに分析エンジンの過去ルックバック深度を設定します。',
    colorDepth: '🎨 カラー予測スピン深度',
    finalDepth: '🔢 下一桁予測スピン深度',
    seriesDepth: '🧭 セクター予測スピン深度',
    sectorsDepth: '🎯 扇区予測スピン深度',
    pocketsDepth: '📏 ポケット距離スピン深度',
    spins: 'スピン',
    resetAll: '全基準を5スピンにリセット',
    defaultNotice: 'デフォルトのルックバック深度は最適なパターン認識のため5スピンに設定されています。',
    reloadTitle: 'アプリの再読み込み・リセット',
    currentVersion: '現在のバージョン: v2.5.0 Pro All-in-One',
    reloadNotice: 'いつでもアプリを再読み込み・再起動できます。現在のスピン履歴と設定を保持するか、全データをリセットするか選択可能です。',
    reloadBtn: 'アプリを再読み込み / 再起動',
    reloadModalTitle: 'アプリの再読み込み確認',
    reloadModalMsg: '現在のスピン履歴と設定を保持したまま再読み込みしますか？それとも全データを消去してリセットしますか？',
    keepDataBtn: '✅ データを保持して再読み込み',
    clearDataBtn: '🗑️ 全データを消去して再読み込み',
    cancelBtn: 'キャンセル',
    disclaimerTitle: '免責事項',
    lastUpdated: '最終更新：2026年8月',
    d1Title: '1. 純粋な統計・分析ツール',
    d1Text: '本アプリケーション（「ルーレットトラッカー」）は、データの記録、統計分析、および娯楽の参考のみを目的としています。提示されるすべてのチャート、傾向、数値は過去のデータであり、将来の結果を保証するものではありません。',
    d2Title: '2. 助言の非提供',
    d2Text: '本アプリは、財務、法律、または意志決定に関する助言を提供するものではありません。本アプリのデータに基づいて行われるいかなる行動も、ユーザー自身の個人の選択であり、本アプリとは関係ありません。',
    d3Title: '3. データの正確性の非保証',
    d3Text: 'データの正確性に努めておりますが、100%の正確性、完全性、リアルタイム性を保証するものではありません。入力ミス、システム遅延、技術的問題により統計結果が影響を受ける場合があります。',
    d4Title: '4. 参考データ',
    d4Text: '本アプリが提供するすべての分析結果は参考用であり、決定や保証の根拠として依存すべきではありません。ユーザーは自己の責任においてデータの信頼性を判断してください。',
    d5Title: '5. ユーザーの自己責任',
    d5Text: '本アプリを使用することで、すべての分析出力が純粋な統計的成果物であることを承認し、同意したものとみなされます。提供されたデータに基づく決定や行動については、ユーザーが全責任を負います。',
    d6Title: '6. サードパーティリンク',
    d6Text: '本アプリに第三者ウェブサイトへのリンクが含まれている場合、その内容、運営、セキュリティについて一切の責任を負いません。',
    d7Title: '7. 責任の制限',
    d7Text: '法律で認められる最大限において、本アプリの管理者および開発者は、本アプリの使用または使用不能、あるいはデータへの依存から生じる一切の直接的・間接的損害について責任を負いません。',
    d8Title: '8. 免責事項の変更',
    d8Text: '本免責事項は予告なく更新されることがあります。変更はアプリ内で発表されます。',
  },
  es: {
    setupTitle: 'Configuración del Sistema',
    langLabel: 'Idioma del Sistema',
    setupIntro: 'Configura la profundidad de giros para cada uno de los 5 criterios de predicción.',
    colorDepth: '🎨 Profundidad de Predicción de Color',
    finalDepth: '🔢 Profundidad de Predicción de Dígito Final',
    seriesDepth: '🧭 Profundidad de Predicción de Serie',
    sectorsDepth: '🎯 Profundidad de Predicción de Sectores',
    pocketsDepth: '📏 Profundidad de Pasos de Bolsillos',
    spins: 'Giros',
    resetAll: 'Restablecer todos a 5',
    defaultNotice: 'La profundidad por defecto es de 5 giros para una óptima precisión.',
    reloadTitle: 'Recarga y Reinicio de la App',
    currentVersion: 'Versión Actual: v2.5.0 Pro All-in-One',
    reloadNotice: 'Recargue o reinicie la aplicación en cualquier momento. Elija conservar su historial de giros o borrar todos los datos para reiniciar.',
    reloadBtn: 'Recargar / Reiniciar Aplicación',
    reloadModalTitle: 'Confirmación de Recarga',
    reloadModalMsg: '¿Desea conservar su historial de giros y configuraciones actuales, o borrar todos los datos antes de recargar?',
    keepDataBtn: '✅ Conservar Datos y Recargar',
    clearDataBtn: '🗑️ Borrar Todo y Recargar',
    cancelBtn: 'Cancelar',
    disclaimerTitle: 'DESCARGO DE RESPONSABILIDAD',
    lastUpdated: 'Última actualización: Ago 2026',
    d1Title: '1. Herramienta Puramente Estadística y Analítica',
    d1Text: 'Esta aplicación ("Rastreador Ruleta") está destinada únicamente al registro de datos, análisis estadístico y referencia de entretenimiento. Todos los gráficos, tendencias y valores son datos históricos y no garantizan resultados futuros.',
    d2Title: '2. Sin Asesoramiento',
    d2Text: 'Esta aplicación no proporciona asesoramiento financiero, legal o de toma de decisiones. Cualquier acción tomada basada en los datos es bajo su propia responsabilidad.',
    d3Title: '3. Sin Garantía de Precisión',
    d3Text: 'Nos esforzamos por garantizar la precisión de los registros, pero no podemos garantizar que sean 100% precisos, completos o en tiempo real.',
    d4Title: '4. Datos Solo de Referencia',
    d4Text: 'Todos los resultados analíticos son solo para referencia y no deben considerarse una garantía para ninguna decisión.',
    d5Title: '5. Responsabilidad del Usuario',
    d5Text: 'Al usar esta aplicación, acepta que todos los análisis son productos estadísticos y asume la responsabilidad total de sus acciones.',
    d6Title: '6. Enlaces a Terceros',
    d6Text: 'No asumimos ninguna responsabilidad por el contenido, operación o seguridad de los sitios web de terceros vinculados.',
    d7Title: '7. Limitación de Responsabilidad',
    d7Text: 'En la máxima medida permitida por la ley, los desarrolladores no serán responsables de ninguna pérdida directa o indirecta derivada del uso de esta aplicación.',
    d8Title: '8. Cambios a este Aviso',
    d8Text: 'Nos reservamos el derecho de actualizar este aviso en cualquier momento.',
  },
  ko: {
    setupTitle: '시스템 설정',
    langLabel: '시스템 언어',
    setupIntro: '5가지 예측 기준별로 분석 엔진의 히스토리 스핀 탐색 깊이를 설정합니다.',
    colorDepth: '🎨 색상 예측 스핀 깊이',
    finalDepth: '🔢 끝수 예측 스핀 깊이',
    seriesDepth: '🧭 구역 예측 스핀 깊이',
    sectorsDepth: '🎯 섹터 예측 스핀 깊이',
    pocketsDepth: '📏 포켓 스텝 예측 깊이',
    spins: '스핀',
    resetAll: '전체 5스핀으로 초기화',
    defaultNotice: '기본 탐색 깊이는 최적의 패턴 인식을 위해 5스핀으로 설정되어 있습니다.',
    reloadTitle: '앱 새로고침 및 재시작',
    currentVersion: '현재 버전: v2.5.0 Pro All-in-One',
    reloadNotice: '언제든지 앱을 새로고침하거나 재시작할 수 있습니다. 현재 스핀 기록을 유지할지, 모든 데이터를 지우고 재시작할지 선택할 수 있습니다.',
    reloadBtn: '앱 새로고침 / 재시작',
    reloadModalTitle: '앱 새로고침 확인',
    reloadModalMsg: '현재 스핀 기록과 설정을 유지한 채 새로고침하시겠습니까, 아니면 모든 데이터를 지우고 재시작하시겠습니까?',
    keepDataBtn: '✅ 데이터 유지 및 새로고침',
    clearDataBtn: '🗑️ 모든 데이터 지우기 및 새로고침',
    cancelBtn: '취소',
    disclaimerTitle: '면책 조항',
    lastUpdated: '최종 업데이트: 2026년 8월',
    d1Title: '1. 순수 통계 및 분석 도구',
    d1Text: '본 애플리케이션(\'룰렛 트래커\')은 데이터 기록, 통계 분석 및 오락 참고 목적으로만 제공됩니다. 모든 차트, 추세 및 수치는 과거 데이터이며 향후 결과를 보장하지 않습니다.',
    d2Title: '2. 조언 비제공',
    d2Text: '본 앱은 어떠한 금융, 법률 또는 의사결정 조언도 제공하지 않습니다. 본 앱의 데이터를 기반으로 한 모든 행동은 사용자 본인의 선택입니다.',
    d3Title: '3. 데이터 정확성 미보장',
    d3Text: '데이터 기록의 정확성을 위해 노력하지만, 100% 정확하거나 실시간임을 보장할 수 없습니다. 수동 입력 오류나 시스템 지연이 통계에 영향을 줄 수 있습니다.',
    d4Title: '4. 참고용 데이터',
    d4Text: '제공되는 모든 분석 결과는 단순 참고용이며 보장이나 의사결정의 절대적 근거가 될 수 없습니다.',
    d5Title: '5. 사용자 책임',
    d5Text: '본 앱을 사용함으로써 모든 결과가 통계적 산출물임을 인정하고 본인의 결정과 행동에 대한 모든 책임을 집니다.',
    d6Title: '6. 제3자 링크',
    d6Text: '제3자 웹사이트 링크가 포함된 경우 해당 사이트의 콘텐츠나 보안에 대해 책임을 지지 않습니다.',
    d7Title: '7. 책임의 한계',
    d7Text: '법률이 허용하는 최대 범위 내에서, 개발자는 본 앱 사용이나 데이터 의존으로 인한 직간접적 손실에 대해 책임을 지지 않습니다.',
    d8Title: '8. 면책 조항 변경',
    d8Text: '본 면책 조항은 언제든지 업데이트될 수 있으며 변경 사항은 앱 내에 공지됩니다.',
  },
  vi: {
    setupTitle: 'Cài Đặt Hệ Thống',
    langLabel: 'Ngôn Ngữ Hệ Thống',
    setupIntro: 'Cấu hình độ sâu vòng quay lịch sử của động cơ phân tích cho từng tiêu chí trong 5 tiêu chí dự đoán.',
    colorDepth: '🎨 Độ Sâu Dự Đoán Màu Sắc',
    finalDepth: '🔢 Độ Sâu Dự Đoán Số Cuối',
    seriesDepth: '🧭 Độ Sâu Dự Đoán Phân Vùng',
    sectorsDepth: '🎯 Độ Sâu Dự Đoán Ô Bánh Xe',
    pocketsDepth: '📏 Độ Sâu Bước Ô Khoảng Cách',
    spins: 'Vòng Quay',
    resetAll: 'Đặt Lại Tất Cả Thành 5 Vòng',
    defaultNotice: 'Độ sâu xem lại mặc định được đặt thành 5 vòng quay để nhận diện mẫu tối ưu.',
    reloadTitle: 'Tải Lại & Đặt Lại Ứng Dụng',
    currentVersion: 'Phiên Bản Hiện Tại: v2.5.0 Pro Tất-Cả-Trong-Một',
    reloadNotice: 'Tải lại hoặc khởi động lại ứng dụng bất kỳ lúc nào. Chọn giữ nguyên lịch sử vòng quay và cài đặt hoặc xóa tất cả dữ liệu để làm mới.',
    reloadBtn: 'Tải Lại / Khởi Động Lại Ứng Dụng',
    reloadModalTitle: 'Tải Lại Ứng Dụng',
    reloadModalMsg: 'Bạn muốn giữ lại lịch sử vòng quay và cài đặt hiện tại, hay xóa tất cả dữ liệu phiên trước khi tải lại?',
    keepDataBtn: '✅ Giữ Dữ Liệu & Tải Lại',
    clearDataBtn: '🗑️ Xóa Tất Cả Dữ Liệu & Tải Lại',
    cancelBtn: 'Hủy Bỏ',
    disclaimerTitle: 'TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM',
    lastUpdated: 'Cập nhật lần cuối: Tháng 8, 2026',
    d1Title: '1. Công Cụ Thuần Thống Kê & Phân Tích',
    d1Text: 'Ứng dụng này ("Roulette Tracker") chỉ nhằm mục đích ghi chép dữ liệu, phân tích thống kê và tham khảo giải trí. Tất cả các biểu đồ, xu hướng và giá trị trình bày đều là dữ liệu lịch sử và không đảm bảo kết quả trong tương lai.',
    d2Title: '2. Không Cung Cấp Lời Khuyên',
    d2Text: 'Ứng dụng không cung cấp bất kỳ lời khuyên tài chính, pháp lý hay quyết định nào. Mọi hành động dựa trên dữ liệu ứng dụng là lựa chọn cá nhân của bạn.',
    d3Title: '3. Không Đảm Bảo Chính Xác Tuyệt Đối',
    d3Text: 'Chúng tôi cố gắng đảm bảo tính chính xác của dữ liệu nhưng không thể đảm bảo chính xác 100%, hoàn chỉnh hoặc thời gian thực.',
    d4Title: '4. Dữ Liệu Chỉ Mang Tính Tham Khảo',
    d4Text: 'Tất cả kết quả phân tích chỉ dùng để tham khảo và không nên dùng làm căn cứ duy nhất cho quyết định.',
    d5Title: '5. Trách Nhiệm Của Người Dùng',
    d5Text: 'Bằng việc sử dụng ứng dụng, bạn đồng ý rằng mọi kết quả phân tích là sản phẩm thống kê thuần túy và chịu trách nhiệm hoàn toàn cho các quyết định của mình.',
    d6Title: '6. Liên Kết Bên Thứ Ba',
    d6Text: 'Nếu ứng dụng chứa liên kết đến trang web bên thứ ba, chúng tôi không chịu trách nhiệm về nội dung hay tính an toàn của họ.',
    d7Title: '7. Giới Hạn Trách Nhiệm',
    d7Text: 'Trong phạm vi pháp luật cho phép, nhà phát triển không chịu trách nhiệm cho bất kỳ tổn thất trực tiếp hay gián tiếp nào phát sinh từ việc sử dụng ứng dụng.',
    d8Title: '8. Thay Đổi Tuyên Bố Miễn Trừ',
    d8Text: 'Chúng tôi có quyền cập nhật tuyên bố miễn trừ trách nhiệm này bất kỳ lúc nào.',
  },
};

export const SetupPage: React.FC<SetupPageProps> = ({
  onBack,
  lang,
  setLang,
  fiveDepths,
  setFiveDepths,
  onClearSession,
  isPro = false,
  onActivated = () => {},
}) => {
  const t = labels[lang] || labels['en'];
  const depthOptions = [3, 4, 5, 8, 10];
  const [showReloadModal, setShowReloadModal] = useState<boolean>(false);

  const updateDepth = (key: keyof FiveCriteriaDepths, value: number) => {
    setFiveDepths((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReloadKeepData = () => {
    window.location.reload();
  };

  const handleReloadClearData = () => {
    if (onClearSession) {
      onClearSession();
    } else {
      try {
        localStorage.removeItem('roulette_tracker_session_v1');
      } catch (e) {
        // Ignore
      }
    }
    window.location.reload();
  };

  const depthFields: { key: keyof FiveCriteriaDepths; label: string }[] = [
    { key: 'colorDepth', label: t.colorDepth },
    { key: 'finalDepth', label: t.finalDepth },
    { key: 'seriesDepth', label: t.seriesDepth },
    { key: 'sectorsDepth', label: t.sectorsDepth },
    { key: 'pocketsDepth', label: t.pocketsDepth },
  ];

  return (
    <div className="animate-fade-in pb-20 max-w-3xl mx-auto space-y-5 relative">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-30 py-2.5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition-all border border-gray-800 text-gray-200"
            aria-label="Back"
          >
            <BackIcon />
          </button>
          <div className="flex items-center gap-2">
            <SettingsIcon />
            <h2 className="text-xl font-black text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-gold">{t.setupTitle}</span>
            </h2>
          </div>
        </div>
      </div>

      {/* 👑 VIP ACTIVATION SECTION */}
      <VipActivationCard isPro={isPro} onActivated={onActivated} lang={lang} />

      {/* System Configurations Section */}
      <section className="bg-zinc-950 p-5 rounded-3xl border border-gray-800 shadow-xl space-y-5">
        <div className="flex items-center gap-2 border-b border-gray-800/80 pb-3">
          <SettingsIcon />
          <div>
            <h3 className="text-xs font-black uppercase text-gold tracking-widest">{t.setupTitle}</h3>
            <p className="text-[11px] text-gray-400 font-medium">{t.setupIntro}</p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase text-gray-300 tracking-wider block">
            {t.langLabel}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {languages.map((item) => {
              const isSelected = lang === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`py-2 px-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-gold text-black border-gold font-black shadow-lg shadow-amber-500/10'
                      : 'bg-zinc-900 text-gray-300 border-gray-800 hover:border-gray-700 hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-sm">{item.flag}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5 Criteria Spin Lookback Depth Settings */}
        <div className="space-y-4 border-t border-gray-800/80 pt-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-xs font-black text-gold uppercase tracking-wider">
              5 Prediction Criteria Lookback Depths
            </h4>
            <button
              type="button"
              onClick={() => setFiveDepths({ colorDepth: 5, finalDepth: 5, seriesDepth: 5, sectorsDepth: 5, pocketsDepth: 5 })}
              className="px-2.5 py-1 text-[10px] font-black rounded-xl bg-gold/20 text-gold hover:bg-gold hover:text-black transition-all border border-gold/40 active:scale-95 shadow-sm"
            >
              🔄 {t.resetAll}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {depthFields.map(({ key, label }) => {
              const currentValue = fiveDepths[key] || 5;
              return (
                <div key={key} className="bg-zinc-900/90 p-3.5 rounded-2xl border border-gray-800 space-y-2 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-gray-200 uppercase tracking-wide">
                      {label}
                    </span>
                    <span className="text-xs font-black text-gold bg-zinc-950 px-2 py-0.5 rounded-md border border-gray-800">
                      {currentValue} {t.spins}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {depthOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateDepth(key, opt)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                          currentValue === opt
                            ? 'bg-gold text-black shadow-md font-extrabold'
                            : 'bg-zinc-950 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-gray-400 font-medium italic pt-1">
            💡 {t.defaultNotice}
          </p>
        </div>

        {/* Reload Application Section */}
        <div className="space-y-3.5 border-t border-gray-800/80 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🔄</span> {t.reloadTitle}
            </h4>
            <span className="text-[10px] font-bold text-gray-400 bg-zinc-900 px-2 py-0.5 rounded-lg border border-gray-800">
              {t.currentVersion}
            </span>
          </div>

          <div className="bg-zinc-900/90 p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow-md">
            <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
              {t.reloadNotice}
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowReloadModal(true)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-gold to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
              >
                <span>🔄</span>
                <span>{t.reloadBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Official Legal Disclaimer Section */}
      <section className="bg-zinc-950 p-5 rounded-3xl border border-amber-500/20 shadow-xl space-y-4 text-gray-300">
        <div className="flex items-center gap-2 border-b border-gray-800/80 pb-3">
          <ShieldIcon />
          <div>
            <h3 className="text-xs font-black uppercase text-amber-400 tracking-widest">
              {t.disclaimerTitle}
            </h3>
            <p className="text-[10px] text-gray-400 font-bold">{t.lastUpdated}</p>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-gray-300 divide-y divide-gray-800/60">
          <div className="pt-2">
            <h4 className="font-bold text-white mb-1">{t.d1Title}</h4>
            <p className="text-gray-400 text-[11px]">{t.d1Text}</p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-white mb-1">{t.d2Title}</h4>
            <p className="text-gray-400 text-[11px]">{t.d2Text}</p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-white mb-1">{t.d3Title}</h4>
            <p className="text-gray-400 text-[11px]">{t.d3Text}</p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-white mb-1">{t.d4Title}</h4>
            <p className="text-gray-400 text-[11px]">{t.d4Text}</p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-white mb-1">{t.d5Title}</h4>
            <p className="text-gray-400 text-[11px]">{t.d5Text}</p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-white mb-1">{t.d6Title}</h4>
            <p className="text-gray-400 text-[11px]">{t.d6Text}</p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-white mb-1">{t.d7Title}</h4>
            <p className="text-gray-400 text-[11px]">{t.d7Text}</p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-white mb-1">{t.d8Title}</h4>
            <p className="text-gray-400 text-[11px]">{t.d8Text}</p>
          </div>
        </div>
      </section>

      {/* Reload Confirmation Modal */}
      {showReloadModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-950 border border-gold/50 p-5 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-2xl text-gold shadow-md">
              🔄
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-gold uppercase tracking-wider">
                {t.reloadModalTitle}
              </h3>
              <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                {t.reloadModalMsg}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleReloadKeepData}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 text-white font-extrabold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <span>{t.keepDataBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleReloadClearData}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-700 via-roulette-red to-red-600 text-white font-extrabold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-1.5"
              >
                <span>{t.clearDataBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReloadModal(false)}
                className="w-full py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gray-400 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all border border-gray-800"
              >
                {t.cancelBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


