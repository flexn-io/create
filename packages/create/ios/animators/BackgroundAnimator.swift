import Foundation

class BackgroundAnimator: Animator {
    var view: UIView
    var AnimProperty: AnimatorProperty


    required init(view: UIView, args: NSDictionary) {
        self.view = view
        self.AnimProperty = AnimatorProperty(args: args)
    }
    
    func onFocus(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: self.AnimProperty.focusDuration, options: .transitionCrossDissolve, animations: {
                self.view.backgroundColor = self.AnimProperty.focusBackgroundColor
            }, completion: nil)
        } else {
            self.view.backgroundColor = self.AnimProperty.focusBackgroundColor
        }
    }
    
    func onBlur(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: self.AnimProperty.blurDuration, options: .transitionCrossDissolve, animations: {
                self.view.backgroundColor = self.AnimProperty.blurBackgroundColor
            }, completion: nil)
        } else {
            self.view.backgroundColor = self.AnimProperty.blurBackgroundColor
        }
    }
    
    func addChildView(view: UIView) {
        
    }
}
