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
            UIView.transition(with: self.view, duration: self.AnimProperty.duration, options: .transitionCrossDissolve, animations: {
                self.view.layer.backgroundColor = self.AnimProperty.backgroundColor
            }, completion: nil)
        } else {
            self.view.layer.backgroundColor = self.AnimProperty.backgroundColor
        }
    }
    
    func onBlur(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: self.AnimProperty.duration, options: .transitionCrossDissolve, animations: {
                self.view.layer.backgroundColor = self.AnimProperty.backgroundColorBlur
            }, completion: nil)
        } else {
            self.view.layer.backgroundColor = self.AnimProperty.backgroundColorBlur
        }
    }
    
    func addChildView(view: UIView) {
        
    }
}
