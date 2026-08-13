export type Pledge = {
  text: string;
  escapePlan: string;
  signatureDataUrl: string | null;
  name: string | null;
};

const DEFAULT_PLEDGE = `أنا أعلم أن هذه الرغبة موجة عابرة، تعلو ثم تنكسر، ولن تدوم.
أعاهد نفسي أن لا أبيع صفاء عقلي وطاقتي مقابل دقائق زائفة.
أنا أكبر من هذه اللحظة، وقد اخترت طريقاً واضحاً ولن أتراجع عنه.
كل مرة أصمد فيها، أصبح الشخص الذي أريد أن أكونه.`;

const DEFAULT_ESCAPE_PLAN =
  "عند أول إشارة رغبة: أضع الهاتف بعيداً، أغسل وجهي بماء بارد، وأخرج من الغرفة فوراً لخمس عشرة دقيقة.";

export function loadPledge(): Pledge {
  if (typeof window === "undefined") {
    return {
      text: DEFAULT_PLEDGE,
      escapePlan: DEFAULT_ESCAPE_PLAN,
      signatureDataUrl: null,
      name: null,
    };
  }
  const read = (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  return {
    text: read("onboarding.pledgeText") || DEFAULT_PLEDGE,
    escapePlan: read("onboarding.escapePlan") || DEFAULT_ESCAPE_PLAN,
    signatureDataUrl: read("onboarding.signature"),
    name: read("onboarding.name"),
  };
}
