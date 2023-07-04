using AutoMapper;
using System.Reflection;

namespace Shared.Helpers.Mapping;

public class MapFromAttribute : Attribute
{
    public MapFromAttribute(Type mapFromType, bool reverseMap = false)
    {
        MapFromType = mapFromType;
        ReverseMap = reverseMap;
    }

    public Type MapFromType { get; }
    public bool ReverseMap { get; }
}

public static class MapFromServiceCollectionExtensions
{
    public static void AddMapFromAttributes(this Profile profile, params Assembly[] assemblies)
    {
        foreach (var assembly in assemblies)
        {
            foreach (var type in assembly.DefinedTypes)
            {
                var attribute = type.GetCustomAttribute<MapFromAttribute>();

                if (attribute != null)
                {
                    if (attribute.ReverseMap)
                    {
                        profile.CreateMap(attribute.MapFromType, type).ReverseMap();
                    }
                    else
                    {
                        profile.CreateMap(attribute.MapFromType, type);
                    }
                }
            }
        }
    }
}
