
#import "RNAppLaunchArguments.h"

@implementation RNAppLaunchArguments

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

// Allows us to access the following information in JS:
//
//  - Application launch arguments: launchArguments
- (NSDictionary *)constantsToExport {
    return @{
         @"launchArguments": [[[NSProcessInfo processInfo] arguments] componentsJoinedByString:@"::"],
    };
}

@end
