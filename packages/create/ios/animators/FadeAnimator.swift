import Foundation

class FadeAnimator: Animator {
    var childView: RCTTVView?
    var duration: TimeInterval

    required init(view: RCTTVView, args: NSDictionary) {
        self.duration = args["duration"] as? TimeInterval ?? 0.2
    }
    
    func onFocus(animated: Bool) {
        if (self.childView != nil) {
            UIView.animate(withDuration: self.duration) {
                self.childView?.alpha = 1.0
            }
        }
    }
    
    func onBlur(animated: Bool) {
        if (self.childView != nil) {
            UIView.animate(withDuration: self.duration) {
                self.childView?.alpha = 0
            }
        }
    }
    
    func addChildView(view: RCTTVView) {
        self.childView = view
    }
}
