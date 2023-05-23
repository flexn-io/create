import Foundation

class BorderAnimator: Animator {
    var view: UIView
    var AnimProperty: AnimatorProperty
    
    required init(view: UIView, args: NSDictionary) {
        self.view = view
        self.AnimProperty = AnimatorProperty(args: args)
        self.view.layer.masksToBounds = true
    }
    
    func onFocus(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: AnimProperty.focusDuration, options: .transitionCrossDissolve, animations: {
                self.view.layer.borderColor = self.AnimProperty.focusBorderColor
                self.view.layer.borderWidth = self.AnimProperty.focusBorderWidth
            }, completion: nil)
        } else {
            self.view.layer.borderColor = self.AnimProperty.focusBorderColor
            self.view.layer.borderWidth = self.AnimProperty.focusBorderWidth
        }
    }
    
    func onBlur(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: AnimProperty.blurDuration, options: .transitionCrossDissolve, animations: {
                self.view.layer.borderColor = self.AnimProperty.blurBorderColor
                self.view.layer.borderWidth = self.AnimProperty.blurBorderWidth
            }, completion: nil)
        } else {
            self.view.layer.borderColor = self.AnimProperty.blurBorderColor
            self.view.layer.borderWidth = self.AnimProperty.blurBorderWidth
        }
    }
    
    
    func addChildView(view: UIView) {
        
    }
}
