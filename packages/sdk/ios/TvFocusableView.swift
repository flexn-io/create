class TvFocusableView : RCTTVView {
    private var selectedAnimator: Animator? = nil

    private var _isFocused: Bool = false
    
    @objc(setAnimatorOptions:)
    public func setAnimatorOptions(animatorOptions: NSDictionary) {
        if (selectedAnimator != nil) {
            selectedAnimator = nil
        }
        selectedAnimator = AnimatorSelector.selectAnimator(view: self, args: animatorOptions)
        if (_isFocused) {
            focus(animated: false)
        } else {
            blur(animated: false)
        }
    }
    
    override func addSubview(_ view: UIView) {
        super.addSubview(view)
        selectedAnimator?.addChildView(view: view)
    }
    
    func focus(animated: Bool) {
        if (self.parentViewController?.isViewLoaded == true) {
            selectedAnimator?.onFocus(animated: animated)
            _isFocused = true
        } else {
            DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(100)) {
                self.selectedAnimator?.onFocus(animated: animated)
                self._isFocused = true
            }
        }
    }
    
    func blur(animated: Bool) {
        selectedAnimator?.onBlur(animated: animated)
        _isFocused = false
    }
}

extension UIView {
    var parentViewController: UIViewController? {
        var parentResponder: UIResponder? = self.next
        while parentResponder != nil {
            if let viewController = parentResponder as? UIViewController {
                return viewController
            }
            parentResponder = parentResponder?.next
        }
        return nil
    }
}
