#import "SEGMixpanelIntegrationFactory.h"
#import "SEGMixpanelIntegration.h"


@implementation SEGMixpanelIntegrationFactory

+ (instancetype)instance
{
    static dispatch_once_t once;
    static SEGMixpanelIntegrationFactory *sharedInstance;
    dispatch_once(&once, ^{
        sharedInstance = [[self alloc] initWithLaunchOptions:nil];
    });
    return sharedInstance;
}

- (instancetype)initWithLaunchOptions:(NSDictionary *)launchOptions
{
    if (self = [super init]) {
        self.launchOptions = launchOptions;
    }
    return self;
}


+ (instancetype)createWithLaunchOptions:(NSString *)token launchOptions:(NSDictionary *)launchOptions
{
    return [[self alloc] initWithLaunchOptions:launchOptions];
}

- (id<SEGIntegration>)createWithSettings:(NSDictionary *)settings forAnalytics:(SEGAnalytics *)analytics 
{
    return [[SEGMixpanelIntegration alloc] initWithSettings:settings andLaunchOptions:self.launchOptions];
}


- (NSString *)key
{
    return @"Mixpanel";
}

@end
