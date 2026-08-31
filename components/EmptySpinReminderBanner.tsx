import React from 'react';
import type { Language } from '../types';

interface EmptySpinReminderBannerProps {
  lang: Language;
}

const translations = {
  en: {
    message: "please input spin number to start analysis function",
    subtext: "Tap any winning roulette number (0-36) on the grid below to generate real-time AI predictions, wheel sectors, and betting signals.",
    actionHint: "Select a number below to begin",
  },
  zh: {
    message: "请录入旋转数字以启动分析功能 (please input spin number to start analysis function)",
    subtext: "点击下方号码盘录入开奖数字（0-36），系统将实时生成 5 维智能预测、轮盘矢量分区及下注策略分析。",
    actionHint: "请在下方点击任意轮盘数字开始",
  },
  ja: {
    message: "分析機能を開始するには、スピン番号を入力してください (please input spin number to start analysis function)",
    subtext: "下のグリッドからルーレットの出目（0〜36）をタップすると、リアルタイム予測と分析が開始されます。",
    actionHint: "下の番号を選択して開始",
  },
  es: {
    message: "Por favor ingrese el número de giro para iniciar la función de análisis (please input spin number to start analysis function)",
    subtext: "Toque cualquier número de la ruleta (0-36) abajo para generar predicciones en tiempo real y señales de apuestas.",
    actionHint: "Seleccione un número abajo para comenzar",
  },
  ko: {
    message: "분석 기능을 시작하려면 스핀 번호를 입력하세요 (please input spin number to start analysis function)",
    subtext: "실시간 AI 예측 및 휠 분석을 시작하려면 아래 번호판에서 당첨 번호(0-36)를 터치하세요.",
    actionHint: "아래에서 번호를 선택하여 시작하세요",
  },
  vi: {
    message: "Vui lòng nhập số vòng quay để bắt đầu chức năng phân tích (please input spin number to start analysis function)",
    subtext: "Chạm vào số trúng thưởng (0-36) trên bảng bên dưới để bắt đầu phân tích và dự đoán thời gian thực.",
    actionHint: "Chọn một số bên dưới để bắt đầu",
  },
};

export const EmptySpinReminderBanner: React.FC<EmptySpinReminderBannerProps> = ({
  lang = 'en',
}) => {
  const t = translations[lang] || translations.en;

  return (
    <div className="bg-gradient-to-r from-amber-950/90 via-zinc-900 to-amber-950/90 border-2 border-amber-500/80 p-3 sm:p-4 rounded-2xl shadow-xl shadow-amber-500/10 space-y-2 animate-pulse transition-all">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-xl text-gold flex-shrink-0">
          🎯
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
              Action Required
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wide mt-0.5 leading-snug">
            "{t.message}"
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-amber-500/20 text-[11px] text-gray-300">
        <span className="text-gray-400 text-[10px] sm:text-[11px]">{t.subtext}</span>
        <span className="text-[10px] font-bold text-gold flex items-center gap-1 flex-shrink-0 ml-2">
          <span>👇</span> {t.actionHint}
        </span>
      </div>
    </div>
  );
};
