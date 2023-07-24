namespace MealPlan.Models.Vapid;

public class VapidSubscription
{
        public string Endpoint { get; set; } = "";
        public DateTime? ExpirationTime { get; set; }

        public string KeysP256DH { get; set; } = "";
        public string KeysAuth { get; set; } = "";
}
