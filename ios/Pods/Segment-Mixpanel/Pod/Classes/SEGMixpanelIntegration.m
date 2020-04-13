#import "SEGMixpanelIntegration.h"
#import <Analytics/SEGAnalyticsUtils.h>


@implementation SEGMixpanelIntegration


- (instancetype)initWithSettings:(NSDictionary *)settings andMixpanel:(Mixpanel *)mixpanel
{
    if (self = [super init]) {
        self.settings = settings;
        self.mixpanel = mixpanel;
    }
    return self;
}

-(instancetype)initWithSettings:(NSDictionary *)settings andLaunchOptions:(NSDictionary *)launchOptions
{

    if (self= [super init]) {
        self.settings = settings;
        NSString *token = [self.settings objectForKey:@"token"];
        self.mixpanel = [Mixpanel sharedInstanceWithToken: token launchOptions:launchOptions];
    }
    return self;
}

+ (NSDictionary *)map:(NSDictionary *)dictionary withMap:(NSDictionary *)map
{
    NSMutableDictionary *mapped = [NSMutableDictionary dictionaryWithDictionary:dictionary];

    [map enumerateKeysAndObjectsUsingBlock:^(NSString *original, NSString *new, BOOL *stop) {
        id data = [mapped objectForKey:original];
        if (data) {
            [mapped setObject:data forKey:new];
            [mapped removeObjectForKey:original];
        }
    }];

    return [mapped copy];
}

- (void)identify:(SEGIdentifyPayload *)payload
{
    // Ensure that the userID is set and valid (i.e. a non-empty string).
    if (payload.userId != nil && [payload.userId length] != 0) {
        [self.mixpanel identify:payload.userId];
        SEGLog(@"[[Mixpanel sharedInstance] identify:%@]", payload.userId);
    }

    // Map the traits to special mixpanel properties.
    NSDictionary *map = [NSDictionary dictionaryWithObjectsAndKeys:
                                          @"$first_name", @"firstName",
                                          @"$last_name", @"lastName",
                                          @"$created", @"createdAt",
                                          @"$last_seen", @"lastSeen",
                                          @"$email", @"email",
                                          @"$name", @"name",
                                          @"$username", @"username",
                                          @"$phone", @"phone", nil];

    if ([self setAllTraitsByDefault]) {
        NSDictionary *mappedTraits = [SEGMixpanelIntegration map:payload.traits withMap:map];

        // Register the mapped traits.
        [self.mixpanel registerSuperProperties:mappedTraits];
        SEGLog(@"[[Mixpanel sharedInstance] registerSuperProperties:%@]", mappedTraits);

        // Mixpanel also has a people API that works seperately, so we set the traits for it as well.
        if ([self peopleEnabled]) {
            // You'll notice that we could also have done: [Mixpanel.sharedInstance.people set:mappedTraits];
            // Using methods instead of properties directly lets us mock them in tests, which is why we use the syntax below.
            [[self.mixpanel people] set:mappedTraits];
            SEGLog(@"[[[Mixpanel sharedInstance] people] set:%@]", mappedTraits);
        }

        return;
    }


    NSArray *superProperties = [self.settings objectForKey:@"superProperties"];
    NSMutableDictionary *superPropertyTraits = [NSMutableDictionary dictionaryWithCapacity:superProperties.count];
    for (NSString *superProperty in superProperties) {
        superPropertyTraits[superProperty] = payload.traits[superProperty];
    }
    NSDictionary *mappedSuperProperties = [SEGMixpanelIntegration map:superPropertyTraits withMap:map];
    [self.mixpanel registerSuperProperties:mappedSuperProperties];
    SEGLog(@"[[Mixpanel sharedInstance] registerSuperProperties:%@]", mappedSuperProperties);

    if ([self peopleEnabled]) {
        NSArray *peopleProperties = [self.settings objectForKey:@"peopleProperties"];
        NSMutableDictionary *peoplePropertyTraits = [NSMutableDictionary dictionaryWithCapacity:peopleProperties.count];
        for (NSString *peopleProperty in peopleProperties) {
            peoplePropertyTraits[peopleProperty] = payload.traits[peopleProperty];
        }
        NSDictionary *mappedPeopleProperties = [SEGMixpanelIntegration map:peoplePropertyTraits withMap:map];
        [[self.mixpanel people] set:mappedPeopleProperties];
        SEGLog(@"[[[Mixpanel sharedInstance] people] set:%@]", mappedSuperProperties);
    }
}

- (void)track:(SEGTrackPayload *)payload
{
    [self realTrack:payload.event properties:payload.properties];
}

- (void)screen:(SEGScreenPayload *)payload
{
    if ([(NSNumber *)[self.settings objectForKey:@"consolidatedPageCalls"] boolValue]) {
        NSMutableDictionary *payloadProps = [NSMutableDictionary dictionaryWithDictionary:payload.properties];
        NSString *event = [[NSString alloc] initWithFormat:@"Loaded a Screen"];
        if (payload.name) {
            [payloadProps setValue:payload.name forKey:@"name"];
        }
        [self realTrack:event properties:payloadProps];
        SEGLog(@"[[Mixpanel sharedInstance] track:'Loaded a Screen' properties:%@]", payloadProps);
        return;
    }
    
    if ([(NSNumber *)[self.settings objectForKey:@"trackAllPages"] boolValue]) {
        NSString *event = [[NSString alloc] initWithFormat:@"Viewed %@ Screen", payload.name];
        [self realTrack:event properties:payload.properties];
        SEGLog(@"[[Mixpanel sharedInstance] track:'Viewed %@ Screen' properties:%@]", payload.name, payload.properties);
        return;
    }

    if ([(NSNumber *)[self.settings objectForKey:@"trackNamedPages"] boolValue] && payload.name) {
        NSString *event = [[NSString alloc] initWithFormat:@"Viewed %@ Screen", payload.name];
        [self realTrack:event properties:payload.properties];
        SEGLog(@"[[Mixpanel sharedInstance] track:'Viewed %@ Screen' properties:%@]", payload.name, payload.properties);
        return;
    }

    NSString *category = [payload.properties objectForKey:@"category"];
    if ([(NSNumber *)[self.settings objectForKey:@"trackCategorizedPages"] boolValue] && category) {
        NSString *event = [[NSString alloc] initWithFormat:@"Viewed %@ Screen", category];
        SEGLog(@"[[Mixpanel sharedInstance] track:'Viewed %@ Screen' properties:%@]", category, payload.properties);
        [self realTrack:event properties:payload.properties];
    }
}

+ (NSNumber *)extractRevenue:(NSDictionary *)dictionary withKey:(NSString *)revenueKey
{
    id revenueProperty = nil;

    for (NSString *key in dictionary.allKeys) {
        if ([key caseInsensitiveCompare:revenueKey] == NSOrderedSame) {
            revenueProperty = dictionary[key];
            break;
        }
    }

    if (revenueProperty) {
        if ([revenueProperty isKindOfClass:[NSString class]]) {
            // Format the revenue.
            NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
            [formatter setNumberStyle:NSNumberFormatterDecimalStyle];
            return [formatter numberFromString:revenueProperty];
        } else if ([revenueProperty isKindOfClass:[NSNumber class]]) {
            return revenueProperty;
        }
    }
    return nil;
}

- (void)realTrack:(NSString *)event properties:(NSDictionary *)properties
{
    // Track the raw event.
    [self.mixpanel track:event properties:properties];

    // Don't go any further if Mixpanel people is disabled.
    if (![self peopleEnabled]) {
        return;
    }
    
    // Increment properties that are listed in the Mixpanel integration settings
    [self incrementProperties:properties];    

    // Extract the revenue from the properties passed in to us.
    NSNumber *revenue = [SEGMixpanelIntegration extractRevenue:properties withKey:@"revenue"];
    // Check if there was a revenue.
    if (revenue) {
        [[self.mixpanel people] trackCharge:revenue];
        SEGLog(@"[[[Mixpanel sharedInstance] people] trackCharge:%@]", revenue);
    }

    // Mixpanel has the ability keep a running 'count' events. So we check if this is an event
    // that should be incremented (by checking the settings).
    if ([self eventShouldIncrement:event]) {
        [[self.mixpanel people] increment:event by:@1];
        SEGLog(@"[[[Mixpanel sharedInstance] people] increment:%@ by:1]", event);

        NSString *lastEvent = [NSString stringWithFormat:@"Last %@", event];
        NSDate *lastDate = [NSDate date];
        [[self.mixpanel people] set:lastEvent to:lastDate];
        SEGLog(@"[[[Mixpanel sharedInstance] people] set:%@ to:%@]", lastEvent, lastDate);
    }
}

- (void)alias:(SEGAliasPayload *)payload
{
    // Instead of using our own anonymousId, we use Mixpanel's own generated Id.
    NSString *distinctId = [self.mixpanel distinctId];
    [self.mixpanel createAlias:payload.theNewId forDistinctID:distinctId];
    SEGLog(@"[[Mixpanel sharedInstance] createAlias:%@ forDistinctID:%@]", payload.theNewId, distinctId);
}

// Invoked when the device is registered with a push token.
// Mixpanel uses this to send push messages to the device, so forward it to Mixpanel.
- (void)registeredForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    [[self.mixpanel people] addPushDeviceToken:deviceToken];
    SEGLog(@"[[[[Mixpanel sharedInstance] people] addPushDeviceToken:%@]", deviceToken);
}

// An internal utility method that checks the settings to see if this event should be incremented in Mixpanel.
- (BOOL)eventShouldIncrement:(NSString *)event
{
    NSArray *increments = [self.settings objectForKey:@"eventIncrements"];
    for (NSString *increment in increments) {
        if ([event caseInsensitiveCompare:increment] == NSOrderedSame) {
            return YES;
        }
    }
    return NO;
}

// An internal utility method that checks if properties need to be incremented and performs the increment.
- (void)incrementProperties:(NSDictionary *)properties
{
    NSArray *propIncrements = [self.settings objectForKey:@"propIncrements"];
    for (NSString *propIncrement in propIncrements) {
        for (NSString *property in properties) {
            if ([property caseInsensitiveCompare:propIncrement] == NSOrderedSame) {
                [[self.mixpanel people] increment:property by:[properties objectForKey:property]];
                SEGLog(@"[[[Mixpanel sharedInstance] people] increment:%@ by:%@]", property, [properties objectForKey:property]);
            }
        }
    }
}

// Return true the project has the People feature enabled.
- (BOOL)peopleEnabled
{
    return [(NSNumber *)[self.settings objectForKey:@"people"] boolValue];
}

// Return true if all traits should be set by default.
- (BOOL)setAllTraitsByDefault
{
    return [(NSNumber *)[self.settings objectForKey:@"setAllTraitsByDefault"] boolValue];
}

- (void)reset
{
    [self flush];

    [self.mixpanel reset];
    SEGLog(@"[[Mixpanel sharedInstance] reset]");
}

- (void)flush
{
    [self.mixpanel flush];
    SEGLog(@"[[Mixpanel sharedInstance] flush]");
}

@end
