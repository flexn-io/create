import Foundation

class BorderAnimator: Animator {
    var view: UIView
    var AnimProperty: AnimatorProperty
    
    required init(view: UIView, args: NSDictionary) {
        self.view = view
        self.AnimProperty = AnimatorProperty(args: args)
    }
    
    func onFocus(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: AnimProperty.duration, options: .transitionCrossDissolve, animations: {
                self.view.layer.borderColor = self.AnimProperty.borderColor
                self.view.layer.borderWidth = self.AnimProperty.borderWidth
            }, completion: nil)
        } else {
            self.view.layer.borderColor = self.AnimProperty.borderColor
            self.view.layer.borderWidth = self.AnimProperty.borderWidth
        }
    }
    
    func onBlur(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: AnimProperty.duration, options: .transitionCrossDissolve, animations: {
                self.view.layer.borderWidth = 0
            }, completion: nil)
        } else {
            self.view.layer.borderWidth = 0
        }
    }
    
    
    func addChildView(view: UIView) {
        
    }
}
