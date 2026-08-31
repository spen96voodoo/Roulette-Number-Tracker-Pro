import React from 'react';
import type { Language } from '../types';

interface ActivationLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSetup: () => void;
  lang: Language;
}

const modalTranslations = {
  en: {
    title: "50 Spins Limit Reached",
    subtitle: "Activation Required",
    message: "please go set up page input active code for unlimited full version",
    desc: "You have reached the maximum 50 spin numbers limit for this session. Enter your VIP activation code on the Set Up page to unlock unlimited spins and lifetime full features.",
    goToSetupBtn: "Go to Set Up Page",
    closeBtn: "Close",
  },
  zh: {
    title: "已达到 50 局旋转上限",
    subtitle: "需要输入激活码",
    message: "请前往设置页面输入激活码以解锁无限制完整版 (please go set up page input active code for unlimited full version)",
    desc: "您已录入 50 次旋转历史数据（免费完整体验上限）。请前往系统设置页面输入有效 VIP 激活码，即可解锁无限制终身完整版。",
    goToSetupBtn: "前往设置页面输入激活码",
    closeBtn: "关闭",
  },
  ja: {
    title: "50スピンの上限に達しました",
    subtitle: "アクティベーションが必要です",
    message: "無制限のフルバージョンを利用するには、設定ページでアクティベーションコードを入力してください。",
    desc: "無料セッションの最大50スピンに達しました。設定ページでVIPアクティベーションコードを入力して、無制限フルバージョンをお楽しみください。",
    goToSetupBtn: "設定ページへ移動",
    closeBtn: "閉じる",
  },
  es: {
    title: "Límite de 50 Giros Alcanzado",
    subtitle: "Activación Requerida",
    message: "Por favor vaya a la página de configuración e ingrese el código de activación para la versión completa ilimitada.",
    desc: "Ha alcanzado el límite de 50 giros para esta sesión. Ingrese su código de activación VIP en la página de Configuración para desbloquear giros ilimitados.",
    goToSetupBtn: "Ir a Configuración",
    closeBtn: "Cerrar",
  },
  ko: {
    title: "50스핀 제한 도달",
    subtitle: "활성화 코드 필요",
    message: "무제한 풀 버전을 사용하려면 설정 페이지로 이동하여 활성화 코드를 입력하세요.",
    desc: "무료 체험 50스핀 기록 한도에 도달했습니다. 설정 페이지에서 VIP 활성화 코드를 입력하여 무제한 풀 버전을 잠금 해제하세요.",
    goToSetupBtn: "설정 페이지로 이동",
    closeBtn: "닫기",
  },
  vi: {
    title: "Đã Đạt Giới Hạn 50 Vòng Quay",
    subtitle: "Yêu Cầu Kích Hoạt",
    message: "Vui lòng vào trang cài đặt nhập mã kích hoạt để sử dụng phiên bản đầy đủ không giới hạn.",
    desc: "Bạn đã ghi đủ 50 vòng quay trong phiên này. Vui lòng vào trang Cài Đặt và nhập mã kích hoạt VIP để mở khóa phiên bản đầy đủ không giới hạn.",
    goToSetupBtn: "Đến Trang Cài Đặt",
    closeBtn: "Đóng",
  },
};

export const ActivationLimitModal: React.FC<ActivationLimitModalProps> = ({
  isOpen,
  onClose,
  onGoToSetup,
  lang = 'en',
}) => {
  if (!isOpen) return null;
  const t = modalTranslations[lang] || modalTranslations.en;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-md border-2 border-amber-500/80 space-y-4 animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Icon & Title */}
        <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-2xl text-gold shadow-inner flex-shrink-0">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                {t.subtitle}
              </span>
            </div>
            <h3 className="text-base font-black text-white mt-1">
              {t.title}
            </h3>
          </div>
        </div>

        {/* Message Body */}
        <div className="bg-zinc-900/90 p-3.5 rounded-xl border border-amber-500/40 space-y-2">
          <p className="text-xs sm:text-sm font-extrabold text-amber-300 leading-relaxed">
            "{t.message}"
          </p>
          <p className="text-[11px] text-gray-400 leading-normal">
            {t.desc}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 bg-zinc-800 hover:bg-zinc-700 transition-all border border-gray-700 active:scale-95"
          >
            {t.closeBtn}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToSetup();
            }}
            className="px-4 py-2 rounded-xl text-xs font-black text-black bg-gradient-to-r from-gold via-yellow-400 to-amber-500 hover:from-yellow-400 hover:to-amber-400 transition-all shadow-lg shadow-gold/20 flex items-center gap-1.5 active:scale-95"
          >
            <span>⚙️</span>
            <span>{t.goToSetupBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
