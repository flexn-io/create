#import "React/RCTViewManager.h"

@interface TvFocusableView : UIView
    @property (nonatomic, assign) NSDictionary *animatorOptions;
@end

@interface RCT_EXTERN_MODULE(TvFocusableViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(animatorOptions, NSDictionary)

RCT_EXTERN_METHOD(
    cmdFocus: (nonnull NSNumber *)node
)
RCT_EXTERN_METHOD(
    cmdBlur: (nonnull NSNumber *)node
)

@end
