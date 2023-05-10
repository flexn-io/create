import Foundation

class AnimatorSelector {
    enum AnimationTypes: String {
        case animation_scale
        case animation_border
        case animation_scale_with_border
    }
    
    static func selectAnimator(view: UIView, args: NSDictionary) -> Animator? {
        let animationType = args["type"] as? String
        var animator: Animator? = nil
                
        switch animationType! {
            case "scale":
                animator = ScaleAnimator(view: view, args: args)
                break
            case "border":
                animator = BorderAnimator(view: view, args: args)
                break
            case "scale_with_border":
                animator = ScaleWithBorderAnimator(view: view, args: args)
                break
            case "fade":
                animator = FadeAnimator(view: view, args: args)
                break
            case "background":
                animator = BackgroundAnimator(view: view, args: args)
                break
            default: break
        }
        
        return animator ?? nil
    }
}
