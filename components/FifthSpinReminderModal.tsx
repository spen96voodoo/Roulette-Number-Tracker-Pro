import React from 'react';
import type { Language } from '../types';

interface FifthSpinReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToStrategy: () => void;
  onGoToSetup: () => void;
  lang: Language;
}

const translations = {
  en: {
    tag: "5th Spin Milestone",
    title: "Analysis Mode Setup",
    message: "please make sure go SET UP page and STRATEGY page to choose your analysis mode",
    desc: "You have recorded 5 spins! Configure your custom algorithm depths, sector modes, and betting progression to maximize prediction accuracy.",
    btnStrategy: "Go to Strategy Page",
    btnSetup: "Go to Set Up Page",
    btnDismiss: "Got it, continue",
  },
  zh: {
    tag: "第 5 局里程碑提醒",
    title: "分析模式与参数配置",
    message: "请务必前往【设置】页面和【策略】页面选择您的分析模式 (please make sure go SET UP page and STRATEGY page to choose your analysis mode)",
    desc: "您已录入 5 次旋转数据！建议前往设置页面调节回测深度、轮盘分区模式，并在策略页面开启您偏好的相邻闭合或下注策略。",
    btnStrategy: "前往策略页面",
    btnSetup: "前往设置页面",
    btnDismiss: "我知道了，继续分析",
  },
  ja: {
    tag: "5スピン達成リマインダー",
    title: "分析モードの設定",
    message: "SET UPページとSTRATEGYページに移動して、分析モードを選択してください。(please make sure go SET UP page and STRATEGY page to choose your analysis mode)",
    desc: "5回のスピンを記録しました！設定ページおよび戦略ページでアルゴリズム深度やベット戦略を設定してください。",
    btnStrategy: "戦略ページへ",
    btnSetup: "設定ページへ",
    btnDismiss: "了解して続ける",
  },
  es: {
    tag: "Hito del 5° Giro",
    title: "Configuración del Modo de Análisis",
    message: "Por favor asegúrese de ir a la página de CONFIGURACIÓN y a la página de ESTRATEGIA para elegir su modo de análisis.",
    desc: "¡Ha registrado 5 giros! Configure sus profundidades de algoritmo y modos de estrategia para optimizar sus predicciones.",
    btnStrategy: "Ir a Estrategia",
    btnSetup: "Ir a Configuración",
    btnDismiss: "Entendido, continuar",
  },
  ko: {
    tag: "5번째 스핀 알림",
    title: "분석 모드 설정",
    message: "SET UP 페이지와 STRATEGY 페이지로 이동하여 분석 모드를 선택하세요.",
    desc: "5개의 스핀이 기록되었습니다! 예측 정확도를 극대화하기 위해 설정 및 전략 페이지에서 맞춤 모드를 선택하세요.",
    btnStrategy: "전략 페이지로 이동",
    btnSetup: "설정 페이지로 이동",
    btnDismiss: "확인하고 계속하기",
  },
  vi: {
    tag: "Cột Mốc 5 Vòng Quay",
    title: "Thiết Lập Chế Độ Phân Tích",
    message: "Vui lòng vào trang CÀI ĐẶT và CHIẾN LƯỢC để chọn chế độ phân tích của bạn.",
    desc: "Bạn đã ghi lại 5 vòng quay! Hãy vào trang Cài Đặt và Chiến Lược để cấu hình thuật toán và chiến lược tối ưu nhất.",
    btnStrategy: "Đến Trang Chiến Lược",
    btnSetup: "Đến Trang Cài Đặt",
    btnDismiss: "Đã hiểu, tiếp tục",
  },
};

export const FifthSpinReminderModal: React.FC<FifthSpinReminderModalProps> = ({
  isOpen,
  onClose,
  onGoToStrategy,
  onGoToSetup,
  lang = 'en',
}) => {
  if (!isOpen) return null;
  const t = translations[lang] || translations.en;

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Square-styled Card Modal */}
      <div
        className="bg-zinc-950 rounded-3xl shadow-2xl p-6 sm:p-7 w-full max-w-sm sm:max-w-md border-2 border-gold/70 flex flex-col justify-between space-y-4 animate-slide-down relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Row */}
        <div className="flex items-start justify-between border-b border-gray-800 pb-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/50 flex items-center justify-center text-2xl text-gold shadow-inner flex-shrink-0">
              ⚙️
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-gold bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/40 inline-block">
                {t.tag}
              </span>
              <h3 className="text-base font-black text-white mt-1">
                {t.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-all hover:bg-zinc-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Message Box */}
        <div className="bg-zinc-900/90 p-4 rounded-2xl border border-gold/30 space-y-2 relative z-10">
          <p className="text-xs sm:text-sm font-extrabold text-amber-300 leading-snug">
            "{t.message}"
          </p>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Navigation & Action Buttons */}
        <div className="space-y-2 relative z-10 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToStrategy();
              }}
              className="px-3 py-2.5 rounded-xl text-xs font-black text-black bg-gradient-to-r from-gold via-yellow-400 to-amber-500 hover:from-yellow-400 hover:to-amber-400 transition-all shadow-md shadow-gold/20 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>📊</span>
              <span>{t.btnStrategy}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToSetup();
              }}
              className="px-3 py-2.5 rounded-xl text-xs font-black text-white bg-zinc-800 hover:bg-zinc-700 transition-all border border-gray-700 hover:border-gold/40 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>⚙️</span>
              <span>{t.btnSetup}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-200 bg-zinc-900/70 hover:bg-zinc-800/80 transition-all border border-gray-800 active:scale-95"
          >
            {t.btnDismiss}
          </button>
        </div>
      </div>
    </div>
  );
};
