import React, { useState } from 'react';
import {
   Users, TrendingUp, CreditCard, Download,
   Mail, ArrowRight, Copy, Check
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';

export default function PartnerIntroPage() {
   const { t, language } = useLanguage();

   // 新增：申请成为合作伙伴弹窗状态与表单逻辑
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [isContactOpen, setIsContactOpen] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [copiedField, setCopiedField] = useState(null);

   const handleCopy = (text, field) => {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(
        language === 'en' ? 'Copied to clipboard'
        : language === 'ja' ? 'クリップボードにコピーしました'
        : language === 'es' ? 'Copiado al portapapeles'
        : language === 'zh-TW' ? '已複製到剪貼簿'
        : '已复制到剪贴板'
      );
      setTimeout(() => setCopiedField(null), 2000);
   };
   const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      socialPlatform: '',
      socialMedia: ''
   });

   const formLabels = {
      en: {
         firstName: 'First Name', lastName: 'Last Name', email: 'Email', phone: 'Phone', socialPlatform: 'Social Media Platform', socialMedia: 'Social Media Account', submit: 'Submit Application', dialogTitle: 'Apply as Affiliate Partner', dialogDescription: 'Fill in your information to become an affiliate partner.', platformPlaceholder: 'Select a platform'
      },
      ja: {
         firstName: '名', lastName: '姓', email: 'メール', phone: '電話番号', socialPlatform: 'ソーシャルプラットフォーム', socialMedia: 'ソーシャルアカウント', submit: '申請を送信', dialogTitle: 'パートナーに応募', dialogDescription: 'パートナー登録のための情報を入力してください。', platformPlaceholder: 'プラットフォームを選択'
      },
      'zh-CN': {
         firstName: '名', lastName: '姓', email: '邮箱', phone: '电话', socialPlatform: '社交平台', socialMedia: '社交账号', submit: '提交申请', dialogTitle: '申请成为合作伙伴', dialogDescription: '填写你的信息以成为合作伙伴。', platformPlaceholder: '选择平台'
      },
      'zh-TW': {
         firstName: '名', lastName: '姓', email: '電子郵件', phone: '電話', socialPlatform: '社交平台', socialMedia: '社交帳號', submit: '提交申請', dialogTitle: '申請成為合作夥伴', dialogDescription: '填寫你的資訊以成為合作夥伴。', platformPlaceholder: '選擇平台'
      },
      es: {
         firstName: 'Nombre', lastName: 'Apellido', email: 'Correo electrónico', phone: 'Teléfono', socialPlatform: 'Plataforma', socialMedia: 'Cuenta', submit: 'Enviar solicitud', dialogTitle: 'Solicitar como Socio Afiliado', dialogDescription: 'Completa tu información para convertirte en socio afiliado.', platformPlaceholder: 'Seleccionar plataforma'
      }
   };
   const labels = formLabels[language] || formLabels['zh-CN'];

   const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (submitting) return;
      // 简单校验
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.socialPlatform || !formData.socialMedia) {
         toast.error(
           language === 'en' ? 'Please fill in all fields'
           : language === 'ja' ? 'すべての項目を入力してください'
           : language === 'es' ? 'Por favor completa todos los campos'
           : language === 'zh-TW' ? '請填寫所有欄位'
           : '请填写所有字段'
         );
         return;
      }
      try {
         setSubmitting(true);
         // 去重检查
         const { data: existing } = await supabase
            .from('partner_applications')
            .select('id')
            .eq('email', formData.email.trim().toLowerCase())
            .eq('social_platform', formData.socialPlatform)
            .limit(1);
         if (existing && existing.length) {
            toast.error(
              language === 'en' ? 'You already applied with this platform.'
              : language === 'ja' ? 'このプラットフォームでは既に申請済みです。'
              : language === 'es' ? 'Ya aplicaste con esta plataforma.'
              : language === 'zh-TW' ? '此平台已提交過申請。'
              : '该平台已经提交过申请。'
            );
            return;
         }
         const insertPayload = {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            social_platform: formData.socialPlatform,
            social_account: formData.socialMedia.trim(),
            status: 'pending'
         };
         const { error: insertError } = await supabase.from('partner_applications').insert(insertPayload);
             if (insertError) {
            console.error('Insert error:', insertError);
                  toast.error(
                     language === 'en' ? 'Submission failed, please retry.'
                     : language === 'ja' ? '送信に失敗しました。もう一度お試しください。'
                     : language === 'es' ? 'Error al enviar, inténtalo de nuevo.'
                     : language === 'zh-TW' ? '提交失敗，請重試。'
                     : '提交失败，请重试。'
                  );
            return;
         }
             toast.success(
                language === 'en' ? 'Application submitted successfully!'
                : language === 'ja' ? '申請を送信しました！'
                : language === 'es' ? '¡Solicitud enviada con éxito!'
                : language === 'zh-TW' ? '申請提交成功！'
                : '申请提交成功！'
             );
         setFormData({ firstName: '', lastName: '', email: '', phone: '', socialPlatform: '', socialMedia: '' });
         setIsDialogOpen(false);
      } catch (err) {
             console.error('Unexpected submit error:', err);
             toast.error(
                language === 'en' ? 'Unexpected error.'
                : language === 'ja' ? '想定外のエラーが発生しました。'
                : language === 'es' ? 'Error inesperado.'
                : language === 'zh-TW' ? '發生未預期錯誤。'
                : '发生未预期错误。'
             );
      } finally {
         setSubmitting(false);
      }
   };

   return (
    <div className="pt-16 pb-12" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
      <div className="text-center mb-14">
         <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-2xl mb-6 border border-white/10 shadow-[0_0_50px_rgba(74,222,128,0.2)]">
            <Users size={36} className="text-green-400" />
         </div>
         <h1 className="text-4xl md:text-5xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
            {t('partner.intro.heading') || '加入 VGOT 合作伙伴计划'}
         </h1>
         <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            {t('partner.intro.subheading') || '与您的社区分享 VGOT。来自您链接的每个付费订阅都能为您赚取 30% 持续佣金，经由 Stripe 安全结算。'}
         </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14 max-w-6xl mx-auto">
         <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 p-7 rounded-2xl backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
            <div className="bg-purple-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-inner">
               <TrendingUp className="text-purple-400" size={26} />
            </div>
            <h3 className="text-lg font-bold mb-3 text-white">{t('partner.intro.cards.highCommission.title') || '高额持续分佣'}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
               {t('partner.intro.cards.highCommission.description') || '不止首次订阅。用户保持订阅的每一个月，您都可获得 30% 分成。'}
            </p>
         </div>
         <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 p-7 rounded-2xl backdrop-blur-sm hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <div className="bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-inner">
               <CreditCard className="text-blue-400" size={26} />
            </div>
            <h3 className="text-lg font-bold mb-3 text-white">{t('partner.intro.cards.stripeSettlement.title') || 'Stripe 自动结算'}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
               {t('partner.intro.cards.stripeSettlement.description') || '我们为您处理 Stripe Connect，佣金直接转入您的银行账户，透明省心。'}
            </p>
         </div>
         <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 p-7 rounded-2xl backdrop-blur-sm hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
            <div className="bg-pink-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-inner">
               <Download className="text-pink-400" size={26} />
            </div>
            <h3 className="text-lg font-bold mb-3 text-white">{t('partner.intro.cards.marketingResources.title') || '专属营销资源'}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
               {t('partner.intro.cards.marketingResources.description') || '获得官方演示视频、横幅与文案模板，轻松推广提升转化。'}
            </p>
         </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 border border-white/10 rounded-2xl p-12 text-center relative overflow-hidden max-w-5xl mx-auto shadow-xl">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
         <h2 className="text-2xl font-bold mb-4 relative z-10 text-white">{t('partner.intro.cta.title') || '准备好开始赚钱了吗？'}</h2>
         <p className="text-gray-400 text-base mb-8 max-w-2xl mx-auto relative z-10 leading-relaxed">
            {t('partner.intro.cta.description') || '告诉我们您的受众类型。提交后 24 小时内审核并发送 Stripe 邀请。'}
         </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button onClick={() => setIsDialogOpen(true)} className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 shadow-xl">
               {t('partner.intro.cta.applyButton') || '申请成为合作伙伴'} <ArrowRight size={18} />
            </button>
            <button onClick={() => setIsContactOpen(true)} className="bg-transparent border border-white/20 hover:bg-white/5 hover:border-white/30 text-white px-8 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2">
               <Mail size={18} /> {t('partner.intro.cta.contactSupport') || '联系支持团队'}
            </button>
         </div>
      </div>
      {/* 申请成为合作伙伴弹窗 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent className="sm:max-w-[500px] bg-[#0f172a] border-white/10">
            <DialogHeader>
               <DialogTitle className="text-white text-2xl">{labels.dialogTitle}</DialogTitle>
               <DialogDescription className="text-[#9ca3af]">{labels.dialogDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="firstName" className="text-white">{labels.firstName}</Label>
                     <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-[#9ca3af] focus:border-[#4f46e5]" required />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="lastName" className="text-white">{labels.lastName}</Label>
                     <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-[#9ca3af] focus:border-[#4f46e5]" required />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">{labels.email}</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-[#9ca3af] focus:border-[#4f46e5]" required />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">{labels.phone}</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-[#9ca3af] focus:border-[#4f46e5]" required />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="socialPlatform" className="text-white">{labels.socialPlatform}</Label>
                  <Select value={formData.socialPlatform} onValueChange={(val) => handleInputChange('socialPlatform', val)} required>
                     <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#4f46e5]">
                        <SelectValue placeholder={labels.platformPlaceholder} />
                     </SelectTrigger>
                     <SelectContent className="bg-[#1e293b] border-white/10">
                        <SelectItem value="tiktok" className="text-white focus:bg-white/10">TikTok</SelectItem>
                        <SelectItem value="instagram" className="text-white focus:bg-white/10">Instagram</SelectItem>
                        <SelectItem value="youtube" className="text-white focus:bg-white/10">YouTube</SelectItem>
                        <SelectItem value="facebook" className="text-white focus:bg-white/10">Facebook</SelectItem>
                        <SelectItem value="twitter" className="text-white focus:bg-white/10">Twitter/X</SelectItem>
                        <SelectItem value="linkedin" className="text-white focus:bg-white/10">LinkedIn</SelectItem>
                        <SelectItem value="xiaohongshu" className="text-white focus:bg-white/10">小红书</SelectItem>
                        <SelectItem value="weibo" className="text-white focus:bg-white/10">微博</SelectItem>
                        <SelectItem value="other" className="text-white focus:bg-white/10">Other</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <Label htmlFor="socialMedia" className="text-white">{labels.socialMedia}</Label>
                  <Input id="socialMedia" value={formData.socialMedia} onChange={(e) => handleInputChange('socialMedia', e.target.value)} placeholder="@username" className="bg-white/5 border-white/10 text-white placeholder:text-[#9ca3af] focus:border-[#4f46e5]" required />
               </div>
               <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-[#4f46e5] to-[#ec4899] disabled:opacity-50 hover:from-[#4338ca] hover:to-[#db2777] text-white rounded-full py-4 font-medium transition-all">
                  {submitting ? (language === 'en' ? 'Submitting...' : language === 'es' ? 'Enviando...' : language === 'zh-TW' ? '提交中...' : '提交中...') : labels.submit}
               </button>
            </form>
         </DialogContent>
      </Dialog>

      {/* Contact Support Dialog */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
         <DialogContent className="sm:max-w-[500px] bg-[#0f172a]/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
            
            <DialogHeader className="p-6 pb-2 relative">
               <DialogTitle className="text-2xl font-bold text-white text-center">
                  {language === 'en' ? 'Contact Support' : language === 'ja' ? 'サポートに連絡' : language === 'es' ? 'Contactar Soporte' : language === 'zh-TW' ? '聯絡支援' : '联系支持'}
               </DialogTitle>
               <DialogDescription className="text-[#9ca3af] text-center">
                  {language === 'en' ? 'We are here to help. Choose a channel below.' : language === 'ja' ? 'お困りの際はお気軽に。以下の連絡先をご利用ください。' : language === 'es' ? 'Estamos aquí para ayudar. Elige un canal abajo.' : language === 'zh-TW' ? '我們隨時為您提供協助。請選擇以下管道。' : '我们随时为您提供帮助。请选择以下渠道。'}
               </DialogDescription>
            </DialogHeader>

            <div className="p-6 pt-2 space-y-4 relative">
               {/* General Support */}
               <div 
                  onClick={() => handleCopy('service@vgot.ai', 'general')}
                  className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-5 cursor-pointer hover:bg-white/[0.08] hover:border-purple-500/30 transition-all duration-300"
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-500" />
                  
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5b21b6] to-[#4c1d95] flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform duration-300">
                     <Mail className="text-white" size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <div className="text-[#9ca3af] text-xs font-bold tracking-wider mb-1 uppercase flex items-center gap-2">
                        {language === 'en' ? 'General Support' : language === 'ja' ? '一般サポート' : language === 'es' ? 'Soporte General' : language === 'zh-TW' ? '一般支援' : '通用支持'}
                     </div>
                     <div className="text-white text-xl font-medium truncate font-mono">service@vgot.ai</div>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                     {copiedField === 'general' ? (
                        <Check className="text-green-400" size={20} />
                     ) : (
                        <Copy className="text-white/40 group-hover:text-white transition-colors" size={20} />
                     )}
                  </div>
               </div>

               {/* Partner Program */}
               <div 
                  onClick={() => handleCopy('affiliate@vgot.ai', 'partner')}
                  className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-5 cursor-pointer hover:bg-white/[0.08] hover:border-pink-500/30 transition-all duration-300"
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/0 to-pink-500/0 group-hover:from-pink-500/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-500" />
                  
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#be185d] to-[#9d174d] flex items-center justify-center shrink-0 shadow-lg shadow-pink-900/20 group-hover:scale-105 transition-transform duration-300">
                     <Users className="text-white" size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <div className="text-[#9ca3af] text-xs font-bold tracking-wider mb-1 uppercase flex items-center gap-2">
                        {language === 'en' ? 'Partner Program' : language === 'ja' ? 'パートナープログラム' : language === 'es' ? 'Programa de Socios' : language === 'zh-TW' ? '合作夥伴計畫' : '合作伙伴计划'}
                     </div>
                     <div className="text-white text-xl font-medium truncate font-mono">affiliate@vgot.ai</div>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                     {copiedField === 'partner' ? (
                        <Check className="text-green-400" size={20} />
                     ) : (
                        <Copy className="text-white/40 group-hover:text-white transition-colors" size={20} />
                     )}
                  </div>
               </div>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
