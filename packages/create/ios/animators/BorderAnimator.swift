import Foundation

class BorderAnimator: Animator {
    var view: RCTTVView
    var AnimProperty: AnimatorProperty
    
    required init(view: RCTTVView, args: NSDictionary) {
        self.view = view
        self.AnimProperty = AnimatorProperty(args: args)
        self.view.layer.masksToBounds = false
    }

    func onFocus(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: AnimProperty.focusDuration, options: .transitionCrossDissolve, animations: {
                self.view.layer.borderColor = self.AnimProperty.focusBorderColor?.cgColor
                self.view.layer.borderWidth = self.AnimProperty.focusBorderWidth
                self.view.borderColor = self.AnimProperty.focusBorderColor
                self.view.borderWidth = self.AnimProperty.focusBorderWidth
            }, completion: nil)
        } else {
            self.view.layer.borderColor = self.AnimProperty.focusBorderColor?.cgColor
            self.view.layer.borderWidth = self.AnimProperty.focusBorderWidth
            self.view.borderColor = self.AnimProperty.focusBorderColor
            self.view.borderWidth = self.AnimProperty.focusBorderWidth
        }
    }
    
    func onBlur(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: AnimProperty.blurDuration, options: .transitionCrossDissolve, animations: {
                self.view.layer.borderColor = self.AnimProperty.blurBorderColor?.cgColor
                self.view.layer.borderWidth = self.AnimProperty.blurBorderWidth
                self.view.borderColor = self.AnimProperty.blurBorderColor
                self.view.borderWidth = self.AnimProperty.blurBorderWidth
            }, completion: nil)
        } else {
            self.view.layer.borderColor = self.AnimProperty.blurBorderColor?.cgColor
            self.view.layer.borderWidth = self.AnimProperty.blurBorderWidth
            self.view.borderColor = self.AnimProperty.blurBorderColor
            self.view.borderWidth = self.AnimProperty.blurBorderWidth
        }
    }
    
    
    func addChildView(view: RCTTVView) {
        
    }
}
