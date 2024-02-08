import Foundation

class ScaleWithBorderAnimator: Animator {
    var view: RCTTVView
    var scaleAnimator: ScaleAnimator?
    var borderAnimator: BorderAnimator?
    var AnimProperty: AnimatorProperty
    
    required init(view: RCTTVView, args: NSDictionary) {
        self.view = view
        self.scaleAnimator = ScaleAnimator(view: view, args: args)
        self.borderAnimator = BorderAnimator(view: view, args: args)
        self.AnimProperty = AnimatorProperty(args: args)
    }
    
    func onFocus(animated: Bool) {
        self.view.layer.zPosition = 999;
        UIView.transition(with: self.view, duration: AnimProperty.focusDuration, options: .transitionCrossDissolve, animations: {
            self.view.transform = CGAffineTransform(scaleX: self.AnimProperty.focusScale, y: self.AnimProperty.focusScale)
            self.view.layer.borderColor = self.AnimProperty.focusBorderColor?.cgColor
            self.view.layer.borderWidth = self.AnimProperty.focusBorderWidth            
            self.view.borderColor = self.AnimProperty.focusBorderColor
            self.view.borderWidth = self.AnimProperty.focusBorderWidth
        }, completion: nil)
    }

    func onBlur(animated: Bool) {
        self.view.layer.zPosition = self.AnimProperty.zIndex;
        UIView.transition(with: self.view, duration: AnimProperty.blurDuration, options: .transitionCrossDissolve, animations: {
            self.view.transform = CGAffineTransform(scaleX: self.AnimProperty.blurScale, y: self.AnimProperty.blurScale)
            self.view.layer.borderColor = self.AnimProperty.focusBorderColor?.cgColor
            self.view.layer.borderWidth = self.AnimProperty.focusBorderWidth      
            self.view.borderWidth = self.AnimProperty.blurBorderWidth
            self.view.borderColor = self.AnimProperty.blurBorderColor
        }, completion: nil)
    }

    func addChildView(view: RCTTVView) {
        
    }
}
