import Foundation

class FadeAnimator: Animator {
    var childView: UIView?
    var duration: TimeInterval

    required init(view: UIView, args: NSDictionary) {
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
    
    func addChildView(view: UIView) {
        self.childView = view
    }
}
