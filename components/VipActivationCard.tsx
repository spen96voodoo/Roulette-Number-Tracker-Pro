import React, { useState } from 'react';
import { verifyAndActivateCodeLocal } from '../lib/license';
import type { Language } from '../types';

interface VipActivationCardProps {
  isPro: boolean;
  onActivated: () => void;
  lang?: Language;
  compact?: boolean;
}

const translations = {
  en: {
    title: "ACTIVE ALL VIP FUNCTIONS",
    subtitle: "Unlock Wheel Vector, Pocket Distance, Sector Heat, Final Matrix & 5-Criteria Prediction Engine",
    placeholder: "INPUT ACTIVE CODE HERE",
    btnActive: "ACTIVE NOW",
    btnActivating: "Verifying...",
    activeBadge: "VIP UNLOCKED",
    activeDesc: "All VIP analysis engines and prediction features are fully unlocked.",
    lockedNotice: "Please enter a valid activation code to unlock all VIP functions.",
    invalidMsg: "激活码无效 (Invalid activation code)",
    successMsg: "激活成功 (VIP Activated Successfully!)",
    sampleCodeTitle: "Test Activation Codes:",
  },
  zh: {
    title: "激活所有 VIP 高级功能 (ACTIVE ALL VIP FUNCTIONS)",
    subtitle: "解锁轮盘间距、口袋距离、分区走势、尾数矩阵与5大标准预测引擎",
    placeholder: "INPUT ACTIVE CODE HERE",
    btnActive: "立即激活",
    btnActivating: "正在本地规则验证...",
    activeBadge: "VIP 已激活",
    activeDesc: "所有 VIP 高级分析模块与 5 大标准预测引擎已完全解锁。",
    lockedNotice: "请输入有效激活码解锁所有 VIP 高级功能。",
    invalidMsg: "激活码无效",
    successMsg: "激活成功",
    sampleCodeTitle: "测试可用激活码：",
  },
  ja: {
    title: "VIP機能をすべて有効化 (ACTIVE ALL VIP FUNCTIONS)",
    subtitle: "ホイールベクトル、ポケット距離、セクターヒート、末尾マトリックス、5基準予測を解除",
    placeholder: "INPUT ACTIVE CODE HERE",
    btnActive: "今すぐ有効化",
    btnActivating: "検証中...",
    activeBadge: "VIP有効化済み",
    activeDesc: "すべてのVIP分析エンジンと予測機能が解放されています。",
    lockedNotice: "有効なアクティベーションコードを入力して解除してください。",
    invalidMsg: "アクティベーションコードが無効です。",
    successMsg: "アクティベーションに成功しました！",
    sampleCodeTitle: "テスト用コード：",
  },
  es: {
    title: "ACTIVAR TODAS LAS FUNCIONES VIP",
    subtitle: "Desbloquea Vector Rueda, Distancia Bolsillo, Sectores, Matriz Final y Motor 5 Criterios",
    placeholder: "INPUT ACTIVE CODE HERE",
    btnActive: "ACTIVAR AHORA",
    btnActivating: "Verificando...",
    activeBadge: "VIP ACTIVADO",
    activeDesc: "Todas las funciones VIP y motores de predicción están completamente desbloqueados.",
    lockedNotice: "Ingrese un código de activación válido para desbloquear.",
    invalidMsg: "Código de activación no válido",
    successMsg: "¡Activación Exitosa!",
    sampleCodeTitle: "Códigos de prueba:",
  },
  ko: {
    title: "모든 VIP 기능 활성화 (ACTIVE ALL VIP FUNCTIONS)",
    subtitle: "휠 벡터, 포켓 거리, 섹터 히트, 끝수 행렬, 5기준 예측 엔진 잠금 해제",
    placeholder: "INPUT ACTIVE CODE HERE",
    btnActive: "지금 활성화",
    btnActivating: "검증 중...",
    activeBadge: "VIP 활성화됨",
    activeDesc: "모든 VIP 분석 엔진 및 예측 기능이 해제되었습니다.",
    lockedNotice: "올바른 활성화 코드를 입력하여 잠금을 해제하세요.",
    invalidMsg: "활성화 코드가 유효하지 않습니다.",
    successMsg: "성공적으로 활성화되었습니다!",
    sampleCodeTitle: "테스트용 코드:",
  },
  vi: {
    title: "KÍCH HOẠT TẤT CẢ TÍNH NĂNG VIP (ACTIVE ALL VIP FUNCTIONS)",
    subtitle: "Mở khóa Véctơ Vòng Quay, Khoảng Cách Ô, Phân Vùng, Ma Trận Số Cuối & Động Cơ Dự Đoán 5 Tiêu Chí",
    placeholder: "INPUT ACTIVE CODE HERE",
    btnActive: "KÍCH HOẠT NGAY",
    btnActivating: "Đang xác thực...",
    activeBadge: "ĐÃ MỞ KHÓA VIP",
    activeDesc: "Tất cả các công cụ phân tích VIP và động cơ dự đoán đã được mở khóa hoàn toàn.",
    lockedNotice: "Vui lòng nhập mã kích hoạt hợp lệ để mở khóa tất cả chức năng VIP.",
    invalidMsg: "Mã kích hoạt không hợp lệ",
    successMsg: "Kích hoạt VIP thành công!",
    sampleCodeTitle: "Mã kích hoạt dùng thử:",
  },
};

export const VipActivationCard: React.FC<VipActivationCardProps> = ({
  isPro,
  onActivated,
  lang = 'en',
  compact = false,
}) => {
  const t = translations[lang] || translations.en;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleActivate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) {
      setMessage({ type: 'error', text: t.invalidMsg });
      return;
    }

    setLoading(true);
    setMessage(null);

    const res = verifyAndActivateCodeLocal(code);
    setLoading(false);

    if (res.success) {
      setMessage({ type: 'success', text: t.successMsg });
      setCode('');
      onActivated();
    } else {
      setMessage({ type: 'error', text: res.message || t.invalidMsg });
    }
  };

  if (isPro) {
    return (
      <div className={`bg-gradient-to-r from-amber-950/80 via-zinc-900 to-amber-950/80 p-4 rounded-2xl border border-gold/60 shadow-xl flex items-center justify-between gap-3 ${compact ? 'py-3' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/50 flex items-center justify-center text-gold text-xl shadow-inner flex-shrink-0">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-gold uppercase tracking-wider">{t.title}</span>
              <span className="text-[9px] font-black bg-gold text-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                {t.activeBadge}
              </span>
            </div>
            <p className="text-[11px] text-gray-300 font-medium mt-0.5">{t.activeDesc}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 border border-emerald-500/50 px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1">
            <span>✓</span>
            <span>PRO ACTIVE</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4 sm:p-5 rounded-2xl border border-gold/50 shadow-2xl space-y-3.5 relative overflow-hidden">
      {/* Gold Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-gold to-yellow-400" />

      <div className="flex items-center gap-2.5 border-b border-gray-800/80 pb-3">
        <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-black text-lg shadow-sm">
          👑
        </div>
        <div>
          <h3 className="text-xs font-black uppercase text-gold tracking-widest flex items-center gap-2">
            <span>{t.title}</span>
          </h3>
          <p className="text-[11px] text-gray-400 font-medium">{t.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleActivate} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t.placeholder}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-gray-700/80 text-white placeholder-gray-500 text-xs font-bold focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-inner uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-gold to-yellow-500 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 flex-shrink-0"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t.btnActivating}</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>{t.btnActive}</span>
              </>
            )}
          </button>
        </div>

        {message && (
          <div
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border animate-fade-in ${
              message.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-emerald-500/10'
                : 'bg-red-950/90 text-red-300 border-red-500/50 shadow-red-500/10'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>{message.type === 'success' ? '🎯' : '⚠️'}</span>
              <span>{message.text}</span>
            </span>
          </div>
        )}
      </form>
    </div>
  );
};
